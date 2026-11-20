-- Database schema for B M LOKESHA Portfolio Website
-- Run this in MySQL Workbench, phpMyAdmin, or MySQL CLI:
-- mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    submitted_at VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for storing anonymous visitor sessions
CREATE TABLE IF NOT EXISTS visitor_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_token VARCHAR(100) UNIQUE NOT NULL,
    visitor_display_id VARCHAR(50) NOT NULL,
    first_seen VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for tracking individual project interactions
CREATE TABLE IF NOT EXISTS project_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id VARCHAR(50) NOT NULL,
    project_id INT NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    action VARCHAR(50) NOT NULL,
    activity_date VARCHAR(20) NOT NULL,
    activity_time VARCHAR(20) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    browser VARCHAR(50) NOT NULL,
    traffic_source VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample queries:
-- SELECT * FROM project_activities ORDER BY id DESC;
-- SELECT project_name, COUNT(*) as views FROM project_activities GROUP BY project_name ORDER BY views DESC;
