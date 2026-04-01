CREATE DATABASE IF NOT EXISTS eventhub;
USE eventhub;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    venue VARCHAR(150) NOT NULL,
    date DATE NOT NULL,
    total_capacity INT NOT NULL,
    booked_seats INT DEFAULT 0,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    tickets INT NOT NULL,
    seat_type VARCHAR(20) DEFAULT 'standard',
    total_price DECIMAL(10,2) NOT NULL,
    booking_reference VARCHAR(30) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Seed admin user (password: admin123)
INSERT IGNORE INTO users (fullname, email, username, password, role) VALUES
('Administrator', 'admin@eventhub.com', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Seed events
INSERT IGNORE INTO events (id, name, description, venue, date, total_capacity, booked_seats, price) VALUES
(1, 'Rock Night Live',       'An electrifying rock concert featuring top local bands',          'City Arena, Cape Town',    '2026-04-15', 500,  120, 250.00),
(2, 'Jazz Under the Stars',  'A smooth evening of jazz and fine dining under the open sky',     'Kirstenbosch Gardens',     '2026-04-22', 200,  45,  180.00),
(3, 'Tech Summit 2026',      'Annual technology conference covering AI, Cloud and Web Dev',     'CTICC, Cape Town',         '2026-05-10', 1000, 300, 500.00),
(4, 'Comedy Gala Night',     'Stand-up comedy show with South Africa top comedians',            'Artscape Theatre',         '2026-05-18', 350,  200, 150.00),
(5, 'Food & Wine Festival',  'Celebrate local cuisine and wines from the Cape Winelands',       'V&A Waterfront',           '2026-06-01', 800,  50,  120.00);

-- Seed bookings
INSERT IGNORE INTO bookings (event_id, customer_name, customer_email, customer_phone, tickets, seat_type, total_price, booking_reference) VALUES
(1, 'Sipho Dlamini',    'sipho@gmail.com',    '0711234567', 3, 'standard', 750.00,  'BK-00001-A1B2'),
(1, 'Ayesha Patel',     'ayesha@outlook.com', '0722345678', 2, 'vip',      500.00,  'BK-00002-C3D4'),
(2, 'Fatima Moosa',     'fatima@gmail.com',   '0733456789', 2, 'economy',  360.00,  'BK-00003-E5F6'),
(3, 'Thabo Molefe',     'thabo@techcorp.com', '0744567890', 5, 'vip',      2500.00, 'BK-00004-G7H8'),
(3, 'Sarah Williams',   'sarah@devmail.com',  '0755678901', 4, 'standard', 2000.00, 'BK-00005-I9J0'),
(4, 'Lerato Tau',       'lerato@gmail.com',   '0766789012', 4, 'economy',  600.00,  'BK-00006-K1L2'),
(5, 'Pieter du Plessis','pieter@gmail.com',   '0777890123', 2, 'standard', 240.00,  'BK-00007-M3N4');
