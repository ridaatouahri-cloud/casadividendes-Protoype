-- CasaDividendes Database Schema
-- MySQL 5.7+ compatible

-- Create database (if needed)
-- CREATE DATABASE IF NOT EXISTS casadividendes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE casadividendes;

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('active', 'unsubscribed') DEFAULT 'active',
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rate Limiting Table
CREATE TABLE IF NOT EXISTS rate_limits (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    identifier VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type_identifier (type, identifier),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Create a view for newsletter stats
CREATE OR REPLACE VIEW newsletter_stats AS
SELECT
    COUNT(*) as total_subscribers,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_subscribers,
    SUM(CASE WHEN status = 'unsubscribed' THEN 1 ELSE 0 END) as unsubscribed,
    DATE(MIN(created_at)) as first_subscriber,
    DATE(MAX(created_at)) as latest_subscriber
FROM newsletter_subscribers;

-- Optional: Create a view for contact message stats
CREATE OR REPLACE VIEW contact_stats AS
SELECT
    COUNT(*) as total_messages,
    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_messages,
    SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read_messages,
    SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied_messages,
    DATE(MIN(created_at)) as first_message,
    DATE(MAX(created_at)) as latest_message
FROM contact_messages;
