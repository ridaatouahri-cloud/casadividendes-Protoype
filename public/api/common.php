<?php
/**
 * Common utilities for CasaDividendes API
 */

// Load configuration
function getConfig() {
    static $config = null;
    if ($config === null) {
        $configFile = __DIR__ . '/config.php';
        if (!file_exists($configFile)) {
            die(json_encode([
                'success' => false,
                'error' => 'Configuration file not found. Please copy config.sample.php to config.php and configure it.'
            ]));
        }
        $config = require $configFile;
    }
    return $config;
}

// Get PDO database connection
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        $config = getConfig();
        try {
            $dsn = "mysql:host={$config['DB_HOST']};dbname={$config['DB_NAME']};charset={$config['DB_CHARSET']}";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $pdo = new PDO($dsn, $config['DB_USER'], $config['DB_PASS'], $options);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            die(json_encode([
                'success' => false,
                'error' => 'Database connection failed. Please check your configuration.'
            ]));
        }
    }
    return $pdo;
}

// Set CORS headers
function setCORSHeaders() {
    $config = getConfig();
    $origin = $config['ALLOW_ORIGIN'];

    if (empty($origin)) {
        // Allow any origin in development
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        } else {
            header("Access-Control-Allow-Origin: *");
        }
    } else {
        // Specific origin for production
        header("Access-Control-Allow-Origin: $origin");
    }

    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Max-Age: 86400");

    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Send JSON response
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

// Get client IP address
function getClientIP() {
    $ip = $_SERVER['REMOTE_ADDR'];

    // Check for proxy headers (be cautious with these in production)
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    }

    return $ip;
}

// Get user agent
function getUserAgent() {
    return $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
}

// Rate limiting check
function checkRateLimit($type, $identifier) {
    $config = getConfig();
    $pdo = getDB();

    $limitKey = 'RATE_LIMIT_' . strtoupper($type);
    $maxRequests = $config[$limitKey] ?? 10;

    // Clean up old entries (older than 1 hour)
    $stmt = $pdo->prepare("DELETE FROM rate_limits WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)");
    $stmt->execute();

    // Count recent requests
    $stmt = $pdo->prepare(
        "SELECT COUNT(*) as count FROM rate_limits
         WHERE type = ? AND identifier = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)"
    );
    $stmt->execute([$type, $identifier]);
    $result = $stmt->fetch();

    if ($result['count'] >= $maxRequests) {
        return false;
    }

    // Record this request
    $stmt = $pdo->prepare(
        "INSERT INTO rate_limits (type, identifier, ip_address, user_agent) VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([$type, $identifier, getClientIP(), getUserAgent()]);

    return true;
}

// Validate email address
function validateEmail($email) {
    $config = getConfig();

    if (empty($email)) {
        return ['valid' => false, 'error' => 'Email is required'];
    }

    if (strlen($email) > $config['MAX_EMAIL_LENGTH']) {
        return ['valid' => false, 'error' => 'Email is too long'];
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['valid' => false, 'error' => 'Invalid email format'];
    }

    // Additional checks for common typos
    $domain = substr(strrchr($email, "@"), 1);
    if (empty($domain) || strpos($domain, '.') === false) {
        return ['valid' => false, 'error' => 'Invalid email domain'];
    }

    return ['valid' => true];
}

// Sanitize input
function sanitizeInput($input, $maxLength = null) {
    $input = trim($input);
    $input = strip_tags($input);

    if ($maxLength !== null && strlen($input) > $maxLength) {
        $input = substr($input, 0, $maxLength);
    }

    return $input;
}

// Log error
function logError($message, $context = []) {
    $logEntry = date('Y-m-d H:i:s') . ' - ' . $message;
    if (!empty($context)) {
        $logEntry .= ' - ' . json_encode($context);
    }
    error_log($logEntry);
}
