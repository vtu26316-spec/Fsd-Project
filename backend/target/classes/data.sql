-- Seed events (with explicit IDs)
INSERT INTO events (id, name, description, venue, date, total_capacity, booked_seats, price) VALUES
(1, 'Rock Night Live', 'An electrifying rock concert featuring top local bands', 'City Arena, Cape Town', '2026-04-15', 500, 120, 250.00),
(2, 'Jazz Under the Stars', 'A smooth evening of jazz and fine dining under the open sky', 'Kirstenbosch Gardens', '2026-04-22', 200, 45, 180.00),
(3, 'Tech Summit 2026', 'Annual technology conference covering AI, Cloud and Web Dev', 'CTICC, Cape Town', '2026-05-10', 1000, 300, 500.00),
(4, 'Comedy Gala Night', 'Stand-up comedy show with South Africa top comedians', 'Artscape Theatre', '2026-05-18', 350, 200, 150.00),
(5, 'Food & Wine Festival', 'Celebrate local cuisine and wines from the Cape Winelands', 'V&A Waterfront', '2026-06-01', 800, 50, 120.00);

-- Seed bookings WITHOUT hardcoded IDs so H2 auto-increments cleanly
INSERT INTO bookings (customer_name, customer_email, tickets, total_price, booking_reference, event_id) VALUES
('Sipho Dlamini',    'sipho.dlamini@gmail.com',    3, 750.00,  'BK-00001-A1B2', 1),
('Ayesha Patel',     'ayesha.patel@outlook.com',   2, 500.00,  'BK-00002-C3D4', 1),
('Liam van der Berg','liam.vdb@yahoo.com',          4, 1000.00, 'BK-00003-E5F6', 1),
('Nomsa Khumalo',    'nomsa.k@webmail.co.za',       2, 500.00,  'BK-00004-G7H8', 1),
('Ruan Botha',       'ruan.botha@gmail.com',        1, 250.00,  'BK-00005-I9J0', 1),
('Fatima Moosa',     'fatima.moosa@gmail.com',      2, 360.00,  'BK-00006-K1L2', 2),
('James Nkosi',      'james.nkosi@icloud.com',      3, 540.00,  'BK-00007-M3N4', 2),
('Priya Naidoo',     'priya.naidoo@gmail.com',      1, 180.00,  'BK-00008-O5P6', 2),
('Thabo Molefe',     'thabo.molefe@techcorp.co.za', 5, 2500.00, 'BK-00009-Q7R8', 3),
('Sarah Williams',   'sarah.w@devmail.com',          4, 2000.00, 'BK-00010-S9T0', 3),
('Kagiso Sithole',   'kagiso.s@gmail.com',           3, 1500.00, 'BK-00011-U1V2', 3),
('Zanele Mokoena',   'zanele.m@outlook.com',         2, 1000.00, 'BK-00012-W3X4', 3),
('David Pretorius',  'david.p@yahoo.com',            6, 3000.00, 'BK-00013-Y5Z6', 3),
('Lerato Tau',       'lerato.tau@gmail.com',         4, 600.00,  'BK-00014-A7B8', 4),
('Mike Hendricks',   'mike.h@webmail.co.za',         2, 300.00,  'BK-00015-C9D0', 4),
('Amina Cassim',     'amina.c@gmail.com',            3, 450.00,  'BK-00016-E1F2', 4),
('Pieter du Plessis','pieter.dp@gmail.com',          2, 240.00,  'BK-00017-G3H4', 5),
('Naledi Dube',      'naledi.dube@outlook.com',      1, 120.00,  'BK-00018-I5J6', 5);
