const gameBtn = document.getElementById('gameBtn');
const timerDisplay = document.getElementById('timer');

let startTime;
let timerInterval;
let isRunning = false;

// Add at the top with other constants
const failureMessages = [
    "Oh, you are so bad",
    "You sucked at that",
    "Why are you so bad?",
    "How old are you, 3?",
    "Can't you be better?",
    "You are such a Paul",
    "You suck at this big time",
    "Ah come on, you can do better, can't you?",
    "You are the worst",
    "You are so bad, you should feel bad"
];

// Add this constant with the other messages at the top
const winnerMessage = "You did it, damn, you did! Who would have thought? I didnt.";

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000;
    timerDisplay.textContent = elapsedTime.toFixed(3);
}

function toggleGame() {
    if (!isRunning) {
        // Start the game
        startTime = Date.now();
        isRunning = true;
        document.body.style.backgroundColor = '';
        timerInterval = setInterval(updateTimer, 10);
        gameBtn.textContent = 'Stop';
        gameBtn.classList.remove('start');
        gameBtn.classList.add('stop');
        messageDiv.textContent = ''; // Clear any previous message
    } else {
        // Stop the game
        clearInterval(timerInterval);
        isRunning = false;
        gameBtn.textContent = 'Start';
        gameBtn.classList.remove('stop');
        gameBtn.classList.add('start');
        
        const finalTime = parseFloat(timerDisplay.textContent);
        const difference = Math.abs(1 - finalTime);
        
        if (difference < 0.001) {
            document.body.style.backgroundColor = '#4CAF50';
            // Save game completion status
            const gameStatuses = getCookie('gameStatuses') ? JSON.parse(getCookie('gameStatuses')) : {};
            gameStatuses.oneSecond = true;
            setCookie('gameStatuses', JSON.stringify(gameStatuses));
            messageDiv.textContent = winnerMessage;
            messageDiv.classList.add('winner');
        } else {
            document.body.style.backgroundColor = '#f44336';
            // Show random failure message
            const randomMessage = failureMessages[Math.floor(Math.random() * failureMessages.length)];
            messageDiv.textContent = randomMessage;
            messageDiv.classList.remove('winner');
        }
    }
}

// Add initial class to button
gameBtn.classList.add('start');
gameBtn.addEventListener('click', toggleGame);

// Add cookie functions
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

// Add after the timer div in the HTML
function addMessageDiv() {
    const messageDiv = document.createElement('div');
    messageDiv.id = 'failureMessage';
    document.querySelector('.container').appendChild(messageDiv);
    return messageDiv;
}

const messageDiv = addMessageDiv(); 