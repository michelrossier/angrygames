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
        
        if (difference < 0.901) {
            document.body.style.backgroundColor = '#4CAF50';
        } else {
            document.body.style.backgroundColor = '#f44336';
        }
    }
}

gameBtn.classList.add('start');
gameBtn.addEventListener('click', toggleGame); 