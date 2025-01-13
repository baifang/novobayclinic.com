document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById('send-btn');
    const userMessage = document.getElementById('user-message');
    const chatMessages = document.getElementById('chat-messages');
    const consentCookie = getCookie('cookieConsent');
    // const closeButton = document.getElementById('close-btn');
    // const chatbotContainer = document.getElementById('chatbot-container');

    if (consentCookie !== 'true') {
        // Show the cookie consent banner
        document.getElementById('cookie-consent-banner').style.display = 'block';
    }

    // Handle the consent button click
    document.getElementById('cookie-consent-button').addEventListener('click', function () {
        // Set the cookie to remember the user's consent
        setCookie('cookieConsent', 'true', 365);  // Cookie expires in 365 days

        // Hide the cookie consent banner
        document.getElementById('cookie-consent-banner').style.display = 'none';
    });

    // Ensure send and message input functionality works
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
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendButton.click();
            }
        });
    }
});

document.getElementById('chatbot-container').addEventListener('shown.bs.collapse', function () {
    // Focus on the textarea when the collapse is fully shown
    document.getElementById('user-message').focus();
});

// Function to get a cookie by its name
function getCookie(name) {
    const decodedCookies = decodeURIComponent(document.cookie);
    const cookiesArray = decodedCookies.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

// Function to set a cookie
function setCookie(name, value, days) {
    const expires = new Date();
    // Expires in [] days
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + ";expires=" + expires.toUTCString() + ";path=/";
}

function appendUserMessage(message) {
    const chatMessages = document.getElementById('chat-messages');

    const newMessageBg = document.createElement('div');
    newMessageBg.classList.add('bg-primary', 'text-white', 'ms-5', 'px-2', 'py-2', 'mb-3', 'rounded-3', 'shadow-sm', 'align-self-end', 'd-inline-block', 'text-break', 'lh-sm',);

    const newMessage = document.createElement('p');
    newMessage.textContent = message.trim();
    newMessage.classList.add('mb-0')

    newMessageBg.style.fontSize = '14px';

    newMessageBg.appendChild(newMessage);

    chatMessages.appendChild(newMessageBg);

    chatMessages.scrollTop = chatMessages.scrollHeight;
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
    newMessageBg.classList.add('bg-white', 'text-dark', 'border', 'border-primary', 'border-1', 'me-5', 'px-2', 'py-2', 'mb-3', 'rounded-3', 'shadow-sm', 'align-self-start', 'd-inline-block', 'text-break', 'mw-75', 'lh-sm',);

    newMessageBg.style.fontSize = '14px';

    const newMessage = document.createElement('p');
    newMessage.textContent = message;

    newMessage.classList.add('mb-0')

    newMessageBg.appendChild(newMessage);

    chatMessages.appendChild(newMessageBg);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


const body = document.body;
const chatbotContainer = document.getElementById('chatbot-container');

// Enable scroll locking when the chatbot container is active
chatbotContainer.addEventListener('mouseenter', () => {
    body.classList.add('no-scroll');
});

// Enable scrolling back when mouse leaves the chatbot container
chatbotContainer.addEventListener('mouseleave', () => {
    body.classList.remove('no-scroll');
});

// Close button logic to ensure scroll is enabled when closed
const closeButton = document.getElementById('close-btn');
closeButton.addEventListener('click', () => {
    body.classList.remove('no-scroll');
});


let details = navigator.userAgent;
let regexp = /android|iphone|kindle|ipad/i;
let isMobileDevice = regexp.test(details);
//Text with body OR mail with body and subject
function textOrMail(service) {
    act = '';
    lower = service.toLowerCase();
    if (isMobileDevice) {
        // act = act.concat('<a href="sms:+14088001222"class="btn btn-outline-primary justify-content-sm-center"">Contact Us</a>');
        // act = act.concat('<a href="sms:+14088001222?&body=I am interested in ', service, '. Please contact me. NAME." class="btn btn-primary">Send a message</a>');
        act = act.concat('<a href="sms:+14088001222?&body=I am interested in ', lower, '. Please contact me with more information." class="lead mt-auto">Learn More &rarr;</a>');
    } else {
        // act = act.concat('<a href="mailto:contact@novobayclinic.com"class="btn btn-outline-primary justify-content-sm-center"">Contact Us</a>');
        // act = act.concat('<a href="mailto:contact@novobayclinic.com?&subject=', service, '&body=I am interested in', service, '. Please contact me. NAME." class="btn btn-primary">Send a message</a>');
        act = act.concat('<a href="mailto:contact@novobayclinic.com?&subject=', service, '&body=I am interested in ', lower, '. Please contact me with more information." class="lead mt-auto">Learn More &rarr;</a>');
    }
    document.write(act);
}