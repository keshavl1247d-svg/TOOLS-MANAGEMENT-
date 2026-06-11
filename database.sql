CREATE DATABASE IF NOT EXISTS tool_management_db;
USE tool_management_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  part_number VARCHAR(50) UNIQUE NOT NULL,
  part_name VARCHAR(100) NOT NULL,
  quantity INT DEFAULT 0,
  location VARCHAR(100),
  photo VARCHAR(255),
  status ENUM('Available', 'Out', 'Damaged') DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tool_number VARCHAR(50) UNIQUE NOT NULL,
  tool_name VARCHAR(100) NOT NULL,
  part_id INT NULL,
  status ENUM('IN', 'OUT', 'Damaged') DEFAULT 'IN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS inout_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tool_id INT NOT NULL,
  part_id INT NULL,
  action ENUM('IN', 'OUT') NOT NULL,
  person_name VARCHAR(100) NOT NULL,
  condition_status ENUM('Good', 'Damaged') DEFAULT 'Good',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
  FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE SET NULL
);
