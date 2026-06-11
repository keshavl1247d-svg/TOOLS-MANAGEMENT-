CREATE DATABASE IF NOT EXISTS tool_management;
USE tool_management;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','staff') DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  part_number VARCHAR(50) UNIQUE NOT NULL,
  part_name VARCHAR(100) NOT NULL,
  quantity INT DEFAULT 0,
  location VARCHAR(100),
  status ENUM('Available','Out','Damaged') DEFAULT 'Available',
  photo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tools (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tool_number VARCHAR(50) UNIQUE NOT NULL,
  tool_name VARCHAR(100) NOT NULL,
  part_id INT,
  status ENUM('IN','OUT','Damaged') DEFAULT 'IN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS inout_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tool_id INT,
  part_id INT,
  action ENUM('IN','OUT') NOT NULL,
  person_name VARCHAR(100) NOT NULL,
  condition_status ENUM('Good','Damaged') DEFAULT 'Good',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE SET NULL,
  FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reports_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  report_type ENUM('daily','monthly') NOT NULL,
  generated_by INT,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
);

INSERT IGNORE INTO parts (part_number, part_name, quantity, location, status) VALUES
('P001', 'Drill Bit Set', 5, 'Rack A', 'Available'),
('P002', 'Wrench 12mm', 8, 'Rack B', 'Available'),
('P003', 'Caliper Gauge', 3, 'Rack A', 'Out'),
('P004', 'Torque Driver', 2, 'Cabinet C', 'Damaged'),
('P005', 'Bearing Puller', 4, 'Rack D', 'Available');

INSERT IGNORE INTO tools (tool_number, tool_name, part_id, status) VALUES
('T001', 'Drill Machine', 1, 'IN'),
('T002', 'Bench Wrench', 2, 'OUT'),
('T003', 'Precision Caliper', 3, 'IN'),
('T004', 'Impact Driver', 4, 'Damaged'),
('T005', 'Hydraulic Puller', 5, 'IN');
