const gameBtn = document.getElementById('gameBtn');
const timerDisplay = document.getElementById('timer');

let startTime;
let timerInterval;
let isRunning = false;

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
        } else {
            document.body.style.backgroundColor = '#f44336';
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