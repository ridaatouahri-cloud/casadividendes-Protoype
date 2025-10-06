<?php
/**
 * Newsletter Subscription API Endpoint
 *
 * Handles newsletter subscription requests
 */

require_once __DIR__ . '/common.php';

// Set CORS headers
setCORSHeaders();

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse([
        'success' => false,
        'error' => 'Method not allowed'
    ], 405);
}

// Get and parse JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    jsonResponse([
        'success' => false,
        'error' => 'Invalid JSON data'
    ], 400);
}

// Check honeypot field (anti-spam)
$honeypot = isset($data['hp']) ? trim($data['hp']) : '';
if (!empty($honeypot)) {
    jsonResponse([
        'success' => false,
        'error' => 'Invalid submission detected'
    ], 400);
}

// Validate email
$email = isset($data['email']) ? trim($data['email']) : '';
$validation = validateEmail($email);

if (!$validation['valid']) {
    jsonResponse([
        'success' => false,
        'error' => $validation['error']
    ], 400);
}

$email = strtolower($email);

// Check rate limiting
if (!checkRateLimit('newsletter', $email)) {
    jsonResponse([
        'success' => false,
        'error' => 'Too many requests. Please try again later.'
    ], 429);
}

try {
    $pdo = getDB();

    // Create table if it doesn't exist
    $pdo->exec("
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id, status FROM newsletter_subscribers WHERE email = ?");
    $stmt->execute([$email]);
    $existing = $stmt->fetch();

    if ($existing) {
        if ($existing['status'] === 'active') {
            jsonResponse([
                'success' => true,
                'message' => 'You are already subscribed! Thank you for your interest.'
            ]);
        } else {
            // Reactivate subscription
            $stmt = $pdo->prepare(
                "UPDATE newsletter_subscribers
                 SET status = 'active', ip_address = ?, user_agent = ?, updated_at = NOW()
                 WHERE id = ?"
            );
            $stmt->execute([getClientIP(), getUserAgent(), $existing['id']]);

            jsonResponse([
                'success' => true,
                'message' => 'Your subscription has been reactivated. Welcome back!'
            ]);
        }
    }

    // Insert new subscription
    $stmt = $pdo->prepare(
        "INSERT INTO newsletter_subscribers (email, ip_address, user_agent)
         VALUES (?, ?, ?)"
    );
    $stmt->execute([$email, getClientIP(), getUserAgent()]);

    jsonResponse([
        'success' => true,
        'message' => 'Successfully subscribed! You will receive our latest updates.'
    ]);

} catch (PDOException $e) {
    logError('Newsletter subscription failed', [
        'email' => $email,
        'error' => $e->getMessage()
    ]);

    jsonResponse([
        'success' => false,
        'error' => 'An error occurred while processing your subscription. Please try again.'
    ], 500);
}
