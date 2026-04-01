<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $eventId = isset($_GET['event_id']) ? (int)$_GET['event_id'] : null;

    if ($eventId) {
        $stmt = $conn->prepare("
            SELECT b.*, e.name as event_name, e.date as event_date, e.venue as event_venue
            FROM bookings b JOIN events e ON b.event_id = e.id
            WHERE b.event_id = ? ORDER BY b.created_at DESC");
        $stmt->bind_param('i', $eventId);
    } else {
        $stmt = $conn->prepare("
            SELECT b.*, e.name as event_name, e.date as event_date, e.venue as event_venue
            FROM bookings b JOIN events e ON b.event_id = e.id
            ORDER BY b.created_at DESC");
    }
    $stmt->execute();
    $rows = $stmt->get_result();
    $bookings = [];
    while ($row = $rows->fetch_assoc()) $bookings[] = $row;
    echo json_encode($bookings);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $eventId  = (int)$data['eventId'];
    $name     = $conn->real_escape_string($data['customerName']);
    $email    = $conn->real_escape_string($data['customerEmail']);
    $phone    = $conn->real_escape_string($data['customerPhone'] ?? '');
    $tickets  = (int)$data['tickets'];
    $seatType = $conn->real_escape_string($data['seatType'] ?? 'standard');

    // Get event and check capacity
    $stmt = $conn->prepare("SELECT * FROM events WHERE id = ? FOR UPDATE");
    $stmt->bind_param('i', $eventId);
    $stmt->execute();
    $event = $stmt->get_result()->fetch_assoc();

    if (!$event) {
        http_response_code(404);
        echo json_encode(['error' => 'Event not found']); exit;
    }

    $available = $event['total_capacity'] - $event['booked_seats'];
    if ($tickets > $available) {
        http_response_code(400);
        echo json_encode(['error' => "Only $available seats available"]); exit;
    }

    // Price multipliers per seat type
    $multipliers = ['economy' => 1.0, 'standard' => 1.5, 'vip' => 2.5];
    $multiplier  = $multipliers[$seatType] ?? 1.0;
    $totalPrice  = $event['price'] * $multiplier * $tickets;

    // Generate unique booking reference
    $ref = 'BK-' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));

    $conn->begin_transaction();
    try {
        // Insert booking
        $stmt = $conn->prepare("INSERT INTO bookings (event_id,customer_name,customer_email,customer_phone,tickets,seat_type,total_price,booking_reference) VALUES (?,?,?,?,?,?,?,?)");
        $stmt->bind_param('isssisds', $eventId,$name,$email,$phone,$tickets,$seatType,$totalPrice,$ref);
        $stmt->execute();

        // Update booked seats
        $stmt2 = $conn->prepare("UPDATE events SET booked_seats = booked_seats + ? WHERE id = ?");
        $stmt2->bind_param('ii', $tickets, $eventId);
        $stmt2->execute();

        $conn->commit();

        echo json_encode([
            'success'          => true,
            'bookingReference' => $ref,
            'customerName'     => $name,
            'customerEmail'    => $email,
            'customerPhone'    => $phone,
            'tickets'          => $tickets,
            'seatType'         => $seatType,
            'totalPrice'       => $totalPrice,
            'event'            => [
                'id'    => $event['id'],
                'name'  => $event['name'],
                'date'  => $event['date'],
                'venue' => $event['venue']
            ]
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['error' => 'Booking failed: ' . $e->getMessage()]);
    }
}
?>
