<?php

$api_url = 'https://api.deepseek.com/chat/completions';
$api_key = 'sk-ec3f5a1dd39d49fcbf3aba7175b80be8';

$data = json_decode(file_get_contents("php://input"), true);

// Check if the message exists
if (!isset($data['message']) || empty($data['message'])) {
    echo json_encode(['status' => 'error', 'message' => 'No message provided']);
    exit;
}

// Initialize the conversation history from the cookie (if it exists)
if (isset($_COOKIE['chat_history'])) {
    $conversation_history = json_decode($_COOKIE['chat_history'], true);
} else {
    // Start a fresh conversation if no cookie exists
    $conversation_history = [
        ['role' => 'system', 'content' => 'You are a helpful assistant.']
    ];
}

// Append the new user message to the conversation history
$conversation_history[] = [
    'role' => 'user',
    'content' => $data['message']
];

// Prepare the post data to send to the API
$post_fields = [
    'model' => 'deepseek-chat',
    'messages' => $conversation_history,
    'stream' => false,
];

// Initialize the cURL request
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $api_key,
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post_fields));  // Send as JSON

$response = curl_exec($ch);

// Handle cURL error
if (curl_errno($ch)) {
    echo json_encode(['status' => 'error', 'message' => curl_error($ch)]);
    exit;
}

curl_close($ch);

// Decode the response from the API
$response_data = json_decode($response, true);

// Check if the response contains a valid message
if (isset($response_data['choices'][0]['message']['content'])) {
    // Append the assistant's reply to the conversation history
    $conversation_history[] = [
        'role' => 'assistant',
        'content' => $response_data['choices'][0]['message']['content']
    ];

    // Set the updated conversation history cookie to expire in 1 hour (you can adjust this)
    setcookie('chat_history', json_encode($conversation_history), time() + 3600, '/'); // Cookie expires in 1 hour

    // Return the assistant's reply
    echo json_encode(['status' => 'success', 'message' => $response_data['choices'][0]['message']['content']]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to get a valid response from the chatbot']);
}
?>
