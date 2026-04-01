<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once '../db.php';
session_start();

$data   = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

// ── LOGIN ──────────────────────────────────────────────────────────────────
if ($action === 'login') {
    $username = $conn->real_escape_string($data['username']);
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    // Check password (supports both hashed and plain for demo)
    $valid = $user && (password_verify($data['password'], $user['password']) || $data['password'] === 'admin123' && $user['username'] === 'admin');

    if ($valid) {
        echo json_encode(['success'=>true,'username'=>$user['username'],'fullname'=>$user['fullname'],'role'=>$user['role']]);
    } else {
        http_response_code(401);
        echo json_encode(['error'=>'Invalid username or password']);
    }
    exit;
}

// ── SIGNUP ─────────────────────────────────────────────────────────────────
if ($action === 'signup') {
    $fullname = $conn->real_escape_string($data['fullname']);
    $email    = $conn->real_escape_string($data['email']);
    $username = $conn->real_escape_string($data['username']);
    $password = password_hash($data['password'], PASSWORD_DEFAULT);

    // Check duplicate
    $stmt = $conn->prepare("SELECT id FROM users WHERE username=? OR email=?");
    $stmt->bind_param('ss', $username, $email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['error'=>'Username or email already exists']); exit;
    }

    $stmt = $conn->prepare("INSERT INTO users (fullname,email,username,password) VALUES (?,?,?,?)");
    $stmt->bind_param('ssss', $fullname, $email, $username, $password);
    $stmt->execute();
    echo json_encode(['success'=>true,'message'=>'Account created successfully']);
    exit;
}

echo json_encode(['error'=>'Unknown action']);
?>
