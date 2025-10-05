<?php
/**
 * CasaDividendes API Configuration
 *
 * Fill in your actual values below.
 */

return [
    // Database Configuration
    'DB_HOST' => '',
    'DB_NAME' => '',
    'DB_USER' => '',
    'DB_PASS' => '',
    'DB_CHARSET' => 'utf8mb4',

    // Email Configuration
    'ADMIN_EMAIL' => '',
    'FROM_EMAIL' => '',
    'FROM_NAME' => 'CasaDividendes',

    // CORS Configuration
    'ALLOW_ORIGIN' => '',

    // Rate Limiting
    'RATE_LIMIT_NEWSLETTER' => 5,
    'RATE_LIMIT_CONTACT' => 10,

    // Security
    'MAX_EMAIL_LENGTH' => 255,
    'MAX_NAME_LENGTH' => 100,
    'MAX_SUBJECT_LENGTH' => 200,
    'MAX_MESSAGE_LENGTH' => 5000,
];
