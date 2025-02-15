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
let isProcessing = false;

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

// Add at the top with other constants
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, isFirework = false) {
        this.x = x;
        this.y = y;
        this.isFirework = isFirework;
        this.size = Math.random() * 8 + 3;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 8 - 4;
        if (isFirework) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2;
            this.speedX = Math.cos(angle) * speed;
            this.speedY = Math.sin(angle) * speed;
            this.size = Math.random() * 3 + 1;
            // Yellow to white colors for firework particles
            const hue = Math.random() * 60; // 0-60 is red to yellow
            const lightness = 70 + Math.random() * 30; // 70-100% lightness for bright colors
            this.color = `hsl(${hue}, 100%, ${lightness}%)`;
        } else {
            this.color = `hsl(${Math.random() * 360}, 100%, 65%)`; // Keep rainbow for initial particles
        }
        this.life = 1;
        this.decay = 0.005;
        if (isFirework) {
            this.decay = 0.02;
        }
        this.gravity = 0.15;
        this.bounce = 0.8;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (!this.isFirework || this.speedY > 0) {
            this.speedY += this.gravity;
        }
        
        // Bounce off edges
        if (!this.isFirework) {
            if (this.y > window.innerHeight) {
                this.y = window.innerHeight;
                this.speedY = -this.speedY * this.bounce;
            }
            if (this.x < 0 || this.x > window.innerWidth) {
                this.speedX = -this.speedX * this.bounce;
            }
        }
        
        this.life -= this.decay;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.min(1, this.life * 2);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles(x, y, amount) {
    for (let i = 0; i < amount; i++) {
        particles.push(new Particle(x, y));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles = particles.filter(p => p.life > 0);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    if (particles.length > 0) {
        requestAnimationFrame(animateParticles);
    } else {
        canvas.classList.remove('active');
    }
}

function createFirework() {
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight;
    const rocket = new Particle(x, y);
    rocket.speedY = -15 - Math.random() * 5;
    rocket.speedX = (Math.random() - 0.5) * 3;
    rocket.size = 3;
    rocket.color = 'white';
    
    particles.push(rocket);
    
    // When rocket explodes
    setTimeout(() => {
        if (rocket.life > 0) {
            const explosionParticles = 50;
            for (let i = 0; i < explosionParticles; i++) {
                particles.push(new Particle(rocket.x, rocket.y, true));
            }
            rocket.life = 0;
        }
    }, 700 + Math.random() * 400);
}

function startFireworks() {
    // Add transition class for smooth fade to black
    document.body.className = 'fade-to-black';
    
    // Start fireworks after the fade is complete (2 seconds)
    setTimeout(() => {
        // Create initial burst of fireworks
        for (let i = 0; i < 5; i++) {
            setTimeout(() => createFirework(), i * 200);
        }
        
        const launchFirework = () => {
            createFirework();
            setTimeout(launchFirework, 600 + Math.random() * 600); // Faster firework launches
        };
        
        launchFirework();
    }, 2000);
    
    // Stop fireworks after 12 seconds
    setTimeout(() => {
        // Final burst of fireworks
        for (let i = 0; i < 8; i++) {
            setTimeout(() => createFirework(), i * 150);
        }
        
        // Clear everything after the final burst
        setTimeout(() => {
            particles = [];
            canvas.classList.remove('active');
            document.body.className = '';
        }, 2000);
    }, 14000);
}

function startParticleEffect() {
    particles = [];
    canvas.classList.add('active');
    
    // Create particles from multiple points around the screen
    const points = [];
    
    // Center burst
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    points.push({ x: centerX, y: centerY });
    
    // Corner bursts
    points.push({ x: 0, y: 0 });
    points.push({ x: window.innerWidth, y: 0 });
    points.push({ x: 0, y: window.innerHeight });
    points.push({ x: window.innerWidth, y: window.innerHeight });
    
    // Random points
    for (let i = 0; i < 5; i++) {
        points.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        });
    }
    
    // Create particles from each point
    points.forEach(point => {
        createParticles(point.x, point.y, 30);
    });
    
    // Add more particles over time
    let burstCount = 0;
    const maxBursts = 16; // Double the bursts for longer animation
    
    function addMoreParticles() {
        if (burstCount < maxBursts) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createParticles(x, y, 20);
            burstCount++;
            setTimeout(addMoreParticles, 500);
        }
    }
    
    setTimeout(addMoreParticles, 500);
    
    animateParticles();
    
    // After 8 seconds, switch to fireworks
    setTimeout(() => {
        particles = [];
        startFireworks();
    }, 8000);
}

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000;
    timerDisplay.textContent = elapsedTime.toFixed(3);
}

function toggleGame() {
    if (isProcessing) return;
    isProcessing = true;
    
    if (!isRunning) {
        // Start the game
        startTime = Date.now();
        isRunning = true;
        document.body.className = ''; // Reset all classes
        timerInterval = setInterval(updateTimer, 10);
        gameBtn.textContent = 'Stop';
        gameBtn.classList.remove('start');
        gameBtn.classList.add('stop');
        messageDiv.textContent = '';
        welcomeDiv.style.display = 'none';
        timerDisplay.classList.add('running');
        isProcessing = false;  // Allow next click immediately
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
            // Perfect!
            document.body.className = 'success';
            // Save game completion status
            const gameStatuses = getCookie('gameStatuses') ? JSON.parse(getCookie('gameStatuses')) : {};
            gameStatuses.oneSecond = true;
            setCookie('gameStatuses', JSON.stringify(gameStatuses));
            messageDiv.textContent = winnerMessage;
            messageDiv.classList.add('winner');
            updatePersonalBest(difference);
            startParticleEffect();
        } else if (difference < 0.01) {
            // Close!
            document.body.className = 'close';
            messageDiv.textContent = "So close! Keep trying!";
            updatePersonalBest(difference);
        } else {
            // Failure
            document.body.className = 'failure';
            const randomMessage = failureMessages[Math.floor(Math.random() * failureMessages.length)];
            messageDiv.textContent = randomMessage;
            messageDiv.classList.remove('winner');
            updatePersonalBest(difference);
        }
        timerDisplay.classList.remove('running');
        isProcessing = false;  // Allow next click immediately
    }
}

// Add initial class to button
gameBtn.classList.add('start');
gameBtn.addEventListener('click', toggleGame);

// Add cookie functions
function getCookie(name) {
    try {
        const value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return value ? value.pop() : null;
    } catch (error) {
        console.error('Error reading cookie:', error);
        return null;
    }
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

// Add at the bottom
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        toggleGame();
    }
});

function updatePersonalBest(difference) {
    const currentBest = parseFloat(getCookie('oneSecondBest') || '999');
    if (difference < currentBest) {
        setCookie('oneSecondBest', difference.toFixed(3));
        messageDiv.textContent += `\nNew personal best: ${difference.toFixed(3)}s off!`;
    }
} 