// Add this at the start of the script
console.log('Script starting...');

const gameBtn = document.getElementById('gameBtn');
const timerDisplay = document.getElementById('timer');
const messageDiv = document.getElementById('failureMessage');
const welcomeDiv = document.getElementById('welcomeMessage');

// Log to check if we found our elements
console.log('Elements found:', {
    gameBtn,
    timerDisplay,
    messageDiv,
    welcomeDiv
});

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
        document.body.style.backgroundColor = '';  // Reset to default blue gradient
        document.body.style.backgroundImage = 'linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 100%)';
        timerInterval = setInterval(updateTimer, 10);
        gameBtn.textContent = 'Stop';
        gameBtn.classList.remove('start');
        gameBtn.classList.add('stop');
        messageDiv.textContent = '';
        welcomeDiv.style.display = 'none';
    } else {
        // Stop the game
        clearInterval(timerInterval);
        isRunning = false;
        gameBtn.textContent = 'Start';
        gameBtn.classList.remove('stop');
        gameBtn.classList.add('start');
        
        // Get and increment attempts
        let attempts = parseInt(getCookie('oneSecondAttempts') || '0');
        attempts++;
        console.log('Setting attempts to:', attempts);
        setCookie('oneSecondAttempts', attempts);
        
        const finalTime = parseFloat(timerDisplay.textContent);
        const difference = Math.abs(1 - finalTime);
        
        if (difference < 0.001) {
            // Success - Green background
            document.body.style.backgroundColor = '#10b981';
            document.body.style.backgroundImage = 'none';
            // Save game completion status
            const gameStatuses = getCookie('gameStatuses') ? JSON.parse(getCookie('gameStatuses')) : {};
            gameStatuses.oneSecond = true;
            setCookie('gameStatuses', JSON.stringify(gameStatuses));
            messageDiv.textContent = winnerMessage;
            messageDiv.classList.add('winner');
        } else {
            // Failure - Red background
            document.body.style.backgroundColor = '#ef4444';
            document.body.style.backgroundImage = 'none';
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
    const value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    const cookieValue = value ? value.pop() : null;
    console.log(`Getting cookie ${name}:`, cookieValue);
    return cookieValue;
}

function setCookie(name, value) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    // Make sure cookie is available in all paths by setting path to root
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
    console.log(`Setting cookie ${name}:`, value);
}

// Get the username from cookie
const userName = getCookie('userName') || 'Player';
console.log('Username:', userName);

// Set the welcome message
if (welcomeDiv) {
    welcomeDiv.textContent = `Okay, ${userName}, let's see what you got`;
    welcomeDiv.style.display = 'block'; // Make sure it's visible
    console.log('Welcome message set');
} else {
    console.error('Welcome div not found!');
} 