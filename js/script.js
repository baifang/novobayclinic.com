document.addEventListener("DOMContentLoaded", function () {

    const sendButton = document.getElementById('send-btn');
    const userMessage = document.getElementById('user-message');
    const chatMessages = document.getElementById('chat-messages');

    if (sendButton && userMessage && chatMessages) {

        sendButton.addEventListener('click', function () {
            const message = userMessage.value.trim();

            if (message) {
                appendUserMessage(message);

                userMessage.value = '';

                chatMessages.scrollTop = chatMessages.scrollHeight;

                sendMessage(message);
            }
        });

        userMessage.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                sendButton.click();
            }
        });
    }
});

function appendUserMessage(message) {
    const chatMessages = document.getElementById('chat-messages');

    const newMessageBg = document.createElement('div');
    newMessageBg.classList.add('bg-primary', 'text-white', 'p-2', 'rounded-3');  // Add styling to the message

    const newMessage = document.createElement('p');
    newMessage.textContent = message;

    newMessageBg.appendChild(newMessage);

    chatMessages.appendChild(newMessageBg);
}

async function sendMessage(message) {
    try {
        const response = await fetch('php/chatbot.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });

        const data = await response.json();

        if (data.status === 'success') {
            appendBotMessage(data.message);
        } else {
            appendBotMessage('Sorry, something went wrong.');
        }
    } catch (error) {
        console.error('Error:', error);
        appendBotMessage('Sorry, there was an error communicating with the server.');
    }
}

function appendBotMessage(message) {
    const chatMessages = document.getElementById('chat-messages');

    const newMessageBg = document.createElement('div');
    newMessageBg.classList.add('bg-light', 'text-dark', 'p-2', 'rounded-3');  // Add styling to the bot message

    const newMessage = document.createElement('p');
    newMessage.textContent = message;

    newMessageBg.appendChild(newMessage);

    chatMessages.appendChild(newMessageBg);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}
