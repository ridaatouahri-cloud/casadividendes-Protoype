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

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id, status FROM newsletter_subscribers WHERE email = ?");
    $stmt->execute([$email]);
    $existing = $stmt->fetch();

    if ($existing) {
        if ($existing['status'] === 'active') {
            jsonResponse([
                'success' => false,
                'error' => 'This email is already subscribed to our newsletter.'
            ], 400);
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
