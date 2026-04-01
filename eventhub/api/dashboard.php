<?php
header('Content-Type: application/json');
require_once '../db.php';

$events   = $conn->query("SELECT *, (total_capacity - booked_seats) AS available FROM events ORDER BY date ASC");
$bookings = $conn->query("SELECT b.*, e.name as event_name FROM bookings b JOIN events e ON b.event_id = e.id ORDER BY b.created_at DESC");
$users    = $conn->query("SELECT id, fullname, username, role, created_at FROM users");

$data = [
    'events'        => $events->fetch_all(MYSQLI_ASSOC),
    'bookings'      => $bookings->fetch_all(MYSQLI_ASSOC),
    'users'         => $users->fetch_all(MYSQLI_ASSOC),
    'total_revenue' => 0
];

foreach ($data['bookings'] as $b) {
    $data['total_revenue'] += $b['total_price'];
}

echo json_encode($data);
?>
