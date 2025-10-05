<?php
/**
 * Contact Form API Endpoint
 *
 * Handles contact form submissions
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

$config = getConfig();

// Validate and sanitize inputs
$name = isset($data['name']) ? sanitizeInput($data['name'], $config['MAX_NAME_LENGTH']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$subject = isset($data['subject']) ? sanitizeInput($data['subject'], $config['MAX_SUBJECT_LENGTH']) : '';
$message = isset($data['message']) ? sanitizeInput($data['message'], $config['MAX_MESSAGE_LENGTH']) : '';

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
} elseif (strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters';
}

$emailValidation = validateEmail($email);
if (!$emailValidation['valid']) {
    $errors[] = $emailValidation['error'];
}

if (empty($subject)) {
    $errors[] = 'Subject is required';
} elseif (strlen($subject) < 3) {
    $errors[] = 'Subject must be at least 3 characters';
}

if (empty($message)) {
    $errors[] = 'Message is required';
} elseif (strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters';
}

if (!empty($errors)) {
    jsonResponse([
        'success' => false,
        'error' => implode('. ', $errors)
    ], 400);
}

$email = strtolower($email);

// Check rate limiting
if (!checkRateLimit('contact', getClientIP())) {
    jsonResponse([
        'success' => false,
        'error' => 'Too many requests. Please try again later.'
    ], 429);
}

try {
    $pdo = getDB();

    // Insert contact message into database
    $stmt = $pdo->prepare(
        "INSERT INTO contact_messages (name, email, subject, message, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([$name, $email, $subject, $message, getClientIP(), getUserAgent()]);
    $messageId = $pdo->lastInsertId();

    // Send email notification to admin
    $adminEmail = $config['ADMIN_EMAIL'];
    $fromEmail = $config['FROM_EMAIL'];
    $fromName = $config['FROM_NAME'];

    if (!empty($adminEmail)) {
        $emailSubject = "[CasaDividendes Contact] $subject";
        $emailBody = "New contact message received:\n\n";
        $emailBody .= "From: $name <$email>\n";
        $emailBody .= "Subject: $subject\n\n";
        $emailBody .= "Message:\n$message\n\n";
        $emailBody .= "---\n";
        $emailBody .= "IP: " . getClientIP() . "\n";
        $emailBody .= "Time: " . date('Y-m-d H:i:s') . "\n";
        $emailBody .= "Message ID: $messageId\n";

        $headers = "From: $fromName <$fromEmail>\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        $mailSent = @mail($adminEmail, $emailSubject, $emailBody, $headers);

        if (!$mailSent) {
            logError('Failed to send contact email notification', [
                'message_id' => $messageId,
                'email' => $email
            ]);
        }
    }

    jsonResponse([
        'success' => true,
        'message' => 'Message sent successfully! We will respond within 48 hours.'
    ]);

} catch (PDOException $e) {
    logError('Contact form submission failed', [
        'email' => $email,
        'error' => $e->getMessage()
    ]);

    jsonResponse([
        'success' => false,
        'error' => 'An error occurred while sending your message. Please try again.'
    ], 500);
}
