<?php

$api_url = 'https://api.deepseek.com/chat/completions';
$api_key = 'sk-ec3f5a1dd39d49fcbf3aba7175b80be8';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['message']) || empty($data['message'])) {
    echo json_encode(['status' => 'error', 'message' => 'No message provided']);
    exit;
}

$post_fields = [
    'model' => 'deepseek-chat',
    'messages' => [
        ['role' => 'system', 'content' => 'You are a helpful assistant.'],
        ['role' => 'user', 'content' => $data['message']],
    ],
    'stream' => false,
];


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

if (curl_errno($ch)) {
    echo json_encode(['status' => 'error', 'message' => curl_error($ch)]);
    exit;
}

curl_close($ch);

$response_data = json_decode($response, true);

if (isset($response_data['choices'][0]['message']['content'])) {
    echo json_encode(['status' => 'success', 'message' => $response_data['choices'][0]['message']['content']]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to get a valid response from the chatbot']);
}
