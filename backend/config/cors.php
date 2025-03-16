<?php

return [
    'paths' => ['api/*'],  // Apply this to all API routes
    'allowed_methods' => ['*'],  // Allow all HTTP methods
    'allowed_origins' => ['http://localhost:3000'], // Your frontend URL
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],  // Allow all headers
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // Allow credentials (cookies or headers)
];
