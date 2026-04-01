<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    if ($id) {
        // GET single event
        $stmt = $conn->prepare("SELECT *, (total_capacity - booked_seats) AS available_seats FROM events WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        if (!$result) { http_response_code(404); echo json_encode(['error'=>'Not found']); exit; }
        echo json_encode($result);
    } else {
        // GET all events
        $result = $conn->query("SELECT *, (total_capacity - booked_seats) AS available_seats FROM events ORDER BY date ASC");
        $events = [];
        while ($row = $result->fetch_assoc()) $events[] = $row;
        echo json_encode($events);
    }
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("INSERT INTO events (name,description,venue,date,total_capacity,price) VALUES (?,?,?,?,?,?)");
    $stmt->bind_param('ssssis', $data['name'],$data['description'],$data['venue'],$data['date'],$data['total_capacity'],$data['price']);
    $stmt->execute();
    echo json_encode(['id' => $conn->insert_id, 'message' => 'Event created']);
}
?>
