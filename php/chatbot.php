<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$api_url = $_ENV['API_URL'];
$api_key = $_ENV['API_KEY'];

if (!$api_url || !$api_key) {
    echo json_encode(['status' => 'error', 'message' => 'API_URL or API_KEY is missing']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['message']) || empty($data['message'])) {
    echo json_encode(['status' => 'error', 'message' => 'No message provided']);
    exit;
}

// Initialize the conversation history from the session (if it exists)
if (isset($_SESSION['chat_history'])) {
    $conversation_history = $_SESSION['chat_history'];
} else {
    // Start a fresh conversation if no session history exists
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

// Check if JSON decoding was successful
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['status' => 'error', 'message' => 'JSON decoding error: ' . json_last_error_msg()]);
    exit;
}

// Check if the response contains a valid message
if (isset($response_data['choices'][0]['message']['content'])) {
    // Append the assistant's reply to the conversation history
    $conversation_history[] = [
        'role' => 'assistant',
        'content' => $response_data['choices'][0]['message']['content']
    ];

    // Save the updated conversation history in the session
    $_SESSION['chat_history'] = $conversation_history;

    // Return the assistant's reply
    echo json_encode([
        'status' => 'success',
        'message' => $response_data['choices'][0]['message']['content']
    ]);
} else {
    // Return raw response if the expected message is not found
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to get a valid response from the chatbot',
        'raw_response' => $response_data
    ]);
}

?>
