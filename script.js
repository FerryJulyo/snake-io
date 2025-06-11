const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const leaderboardList = document.getElementById('leaderboard');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 1; // velocity x
let dy = 0; // velocity y
let score = 0;
let gameInterval;
let gameRunning = false;

function getRandomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function generateFood() {
    food = getRandomPosition();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function update() {
    if (!gameRunning) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check collision with walls
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
        gameOver();
        return;
    }

    // Check collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head); // add new head

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        generateFood();
    } else {
        snake.pop(); // remove tail
    }
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${score}`);
    updateLeaderboard(score);
    resetGame();
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 5, y: 5 };
    dx = 1;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateLeaderboard(newScore) {
    let leaderboard = [];
    for (let i = 0; i < leaderboardList.children.length; i++) {
        const listItem = leaderboardList.children[i];
        const text = listItem.textContent;
        const score = parseInt(text.split(': ')[1]);
        leaderboard.push(score);
    }

    leaderboard.push(newScore);
    leaderboard.sort((a, b) => b - a);
    leaderboard = leaderboard.slice(0, 7); // Keep top 7

    // Update the leaderboard display
    for (let i = 0; i < leaderboardList.children.length; i++) {
        const listItem = leaderboardList.children[i];
        listItem.textContent = `Player ${i + 1}: ${leaderboard[i]}`;
    }
}


function gameLoop() {
    update();
    draw();
}

function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    resetGame();
    generateFood();
    gameInterval = setInterval(gameLoop, 100);
}

// Event listeners
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

startButton.addEventListener('click', startGame);

// Initialize leaderboard (optional - if you want to load from local storage or elsewhere)
// updateLeaderboard(0); // Initialize with current scores in HTML
