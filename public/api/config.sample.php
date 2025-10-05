<?php
/**
 * CasaDividendes API Configuration (Sample)
 *
 * Copy this file to config.php and fill in your actual values.
 * DO NOT commit config.php to version control.
 */

return [
    // Database Configuration
    'DB_HOST' => 'localhost',
    'DB_NAME' => 'your_database_name',
    'DB_USER' => 'your_database_user',
    'DB_PASS' => 'your_database_password',
    'DB_CHARSET' => 'utf8mb4',

    // Email Configuration
    'ADMIN_EMAIL' => 'contact@casadividendes.com',
    'FROM_EMAIL' => 'noreply@casadividendes.com',
    'FROM_NAME' => 'CasaDividendes',

    // CORS Configuration
    // Empty string = allow any origin (dev)
    // Specific domain for production: 'https://casadividendes.com'
    'ALLOW_ORIGIN' => '',

    // Rate Limiting (requests per IP per hour)
    'RATE_LIMIT_NEWSLETTER' => 5,
    'RATE_LIMIT_CONTACT' => 10,

    // Security
    'MAX_EMAIL_LENGTH' => 255,
    'MAX_NAME_LENGTH' => 100,
    'MAX_SUBJECT_LENGTH' => 200,
    'MAX_MESSAGE_LENGTH' => 5000,
];
