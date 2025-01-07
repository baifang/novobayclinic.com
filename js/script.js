// // Get references to elements
// const chatbotToggle = document.getElementById('chatbot-toggle');
// const chatbotContainer = document.getElementById('chatbot-container');
// const closeChatButton = document.getElementById('close-chat');

// // Function to load the chatbot UI dynamically
// function loadChatbotUI() {
//   fetch('chatbot-ui.html')
//     .then(response => response.text())
//     .then(html => {
//       chatbotContainer.innerHTML = html;
//       // Close the chat when the "X" button is clicked
//       document.getElementById('close-chat').addEventListener('click', () => {
//         chatbotContainer.style.display = 'none';
//       });
//     })
//     .catch(error => {
//       console.error("Error loading the chatbot UI:", error);
//     });
// }

// // Toggle the visibility of the chatbot UI when the button is clicked
// chatbotToggle.addEventListener('click', () => {
//   if (chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '') {
//     chatbotContainer.style.display = 'flex';
//     loadChatbotUI();
//   } else {
//     chatbotContainer.style.display = 'none';
//   }
// });
// Ensure that the DOM is fully loaded before binding the event listener
document.addEventListener("DOMContentLoaded", function () {
    // Get the send button and the message textarea
    const sendButton = document.getElementById('send-btn');
    const userMessage = document.getElementById('user-message');
    const chatMessages = document.getElementById('chat-messages');

    // Check if the button and textarea exist in the DOM
    if (sendButton && userMessage && chatMessages) {
        // Add event listener for click
        sendButton.addEventListener('click', function () {
            // Get the message from the textarea
            const message = userMessage.value.trim();

            // Only send the message if it's not empty
            if (message) {
                // Add the message to the chat
                const newMessage = document.createElement('p');
                newMessage.textContent = message;
                chatMessages.appendChild(newMessage);

                // Clear the textarea after sending
                userMessage.value = '';

                // Scroll to the latest message
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    }
});



document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-message').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    console.log("SEND");
    const userMessage = document.getElementById('user-message').value.trim();
    if (!userMessage) return; // Prevent sending empty messages

    // Append User's message
    appendUserMessage(userMessage, 'user');

    // Clear the textarea after sending
    document.getElementById('user-message').value = '';

    // Simulate bot response (you can replace this with a real bot response)
    setTimeout(() => {
        const botMessage = "Thanks for reaching out! How can I assist you today?";  // Sample response
        appendMessage(botMessage, 'bot');
    }, 1000); // Simulate bot thinking time
}

function appendUserMessage(message) {
    const chatMessages = document.getElementById('chat-messages');

    // Create a div to wrap the message with background and other styles
    const newMessageBg = document.createElement('div');
    newMessageBg.classList.add('bg-primary', 'text-white', 'p-2', 'rounded-3');  // Add background and styling to the div

    // Create the paragraph to hold the actual message
    const newMessage = document.createElement('p');
    newMessage.textContent = message;

    // Append the paragraph to the div
    newMessageBg.appendChild(newMessage);

    // Append the div to the chat container
    chatMessages.appendChild(newMessageBg);

    // Scroll to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


