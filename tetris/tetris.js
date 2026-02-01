// Game constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = {
    'I': '#00ffff', // Cyan
    'O': '#ffff00', // Yellow
    'T': '#800080', // Purple
    'S': '#00ff00', // Green
    'Z': '#ff0000', // Red
    'J': '#0000ff', // Blue
    'L': '#ffa500'  // Orange
};

// Tetromino shapes (4x4 grid representations)
const SHAPES = {
    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'O': [
        [1,1],
        [1,1]
    ],
    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0]
    ],
    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0]
    ],
    'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0]
    ]
};

// Game state
let board = [];
let currentPiece = null;
let currentX = 0;
let currentY = 0;
let currentRotation = 0;
let score = 0;
let gameRunning = false;
let gameLoopId = null;
let dropCounter = 0;
let dropInterval = 1000; // milliseconds
let lastTime = 0;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const startButton = document.getElementById('startButton');

// Initialize empty board
function initBoard() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
}

// Get rotated shape
function getRotatedShape(pieceType, rotation) {
    let shape = SHAPES[pieceType];
    
    // O-piece doesn't rotate
    if (pieceType === 'O') {
        return shape;
    }

    // Rotate the shape
    for (let i = 0; i < rotation % 4; i++) {
        const size = shape.length;
        const rotated = Array(size).fill(null).map(() => Array(size).fill(0));
        
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                rotated[col][size - 1 - row] = shape[row][col];
            }
        }
        shape = rotated;
    }
    
    return shape;
}

// Spawn a new random piece
function spawnPiece() {
    const pieces = Object.keys(SHAPES);
    const pieceType = pieces[Math.floor(Math.random() * pieces.length)];
    currentPiece = pieceType;
    currentRotation = 0;
    currentX = Math.floor(COLS / 2) - 1;
    currentY = 0;

    // Check if game over (can't place new piece)
    if (checkCollision(getRotatedShape(currentPiece, currentRotation), currentX, currentY)) {
        gameOver();
        return false;
    }
    return true;
}

// Check collision
function checkCollision(shape, x, y) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newX = x + col;
                const newY = y + row;

                // Check boundaries
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }

                // Check collision with placed pieces (but allow negative Y for spawning)
                if (newY >= 0 && board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Place piece on board
function placePiece() {
    const shape = getRotatedShape(currentPiece, currentRotation);
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const y = currentY + row;
                const x = currentX + col;
                if (y >= 0) {
                    board[y][x] = currentPiece;
                }
            }
        }
    }
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;
    
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            // Remove this line
            board.splice(row, 1);
            // Add empty line at top
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            row++; // Check same row again
        }
    }

    // Update score
    if (linesCleared > 0) {
        const points = [0, 100, 300, 500, 800];
        score += points[linesCleared] || 0;
        scoreElement.textContent = score;
    }
}

// Move piece
function movePiece(dx, dy) {
    if (!currentPiece) return;
    
    const shape = getRotatedShape(currentPiece, currentRotation);
    if (!checkCollision(shape, currentX + dx, currentY + dy)) {
        currentX += dx;
        currentY += dy;
        return true;
    }
    return false;
}

// Rotate piece
function rotatePiece() {
    if (!currentPiece) return;
    
    const newRotation = (currentRotation + 1) % 4;
    const shape = getRotatedShape(currentPiece, newRotation);
    
    if (!checkCollision(shape, currentX, currentY)) {
        currentRotation = newRotation;
        return true;
    }
    
    // Try wall kicks (shift left/right when rotation hits wall)
    if (!checkCollision(shape, currentX - 1, currentY)) {
        currentX -= 1;
        currentRotation = newRotation;
        return true;
    }
    if (!checkCollision(shape, currentX + 1, currentY)) {
        currentX += 1;
        currentRotation = newRotation;
        return true;
    }
    
    return false;
}

// Draw a single block
function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
    
    // Add highlight effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, 5);
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, 5, BLOCK_SIZE - 1);
}

// Draw the board
function drawBoard() {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * BLOCK_SIZE, 0);
        ctx.lineTo(i * BLOCK_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * BLOCK_SIZE);
        ctx.lineTo(canvas.width, i * BLOCK_SIZE);
        ctx.stroke();
    }

    // Draw placed pieces
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                drawBlock(col, row, COLORS[board[row][col]]);
            }
        }
    }

    // Draw current piece
    if (currentPiece) {
        const shape = getRotatedShape(currentPiece, currentRotation);
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = currentX + col;
                    const y = currentY + row;
                    if (y >= 0) {
                        drawBlock(x, y, COLORS[currentPiece]);
                    }
                }
            }
        }
    }
}

// Drop piece down
function dropPiece() {
    if (!movePiece(0, 1)) {
        // Piece can't move down, place it
        placePiece();
        clearLines();
        
        // Spawn new piece
        if (!spawnPiece()) {
            return false;
        }
    }
    return true;
}

// Game loop
function gameLoop(time = 0) {
    if (!gameRunning) return;

    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        if (!dropPiece()) {
            return;
        }
        dropCounter = 0;
    }

    drawBoard();
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    if (gameRunning) return;
    
    initBoard();
    score = 0;
    scoreElement.textContent = score;
    gameOverElement.classList.remove('show');
    startButton.disabled = true;
    startButton.textContent = 'Playing...';
    gameRunning = true;
    lastTime = performance.now();
    dropCounter = 0;
    
    spawnPiece();
    gameLoop();
}

// Game over
function gameOver() {
    gameRunning = false;
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }
    finalScoreElement.textContent = score;
    gameOverElement.classList.add('show');
    startButton.disabled = false;
    startButton.textContent = 'Start Game';
}

// Restart game
function restartGame() {
    gameOverElement.classList.remove('show');
    startGame();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            movePiece(-1, 0);
            drawBoard();
            break;
        case 'ArrowRight':
            e.preventDefault();
            movePiece(1, 0);
            drawBoard();
            break;
        case 'ArrowDown':
            e.preventDefault();
            dropPiece();
            drawBoard();
            break;
        case 'ArrowUp':
        case ' ':
            e.preventDefault();
            rotatePiece();
            drawBoard();
            break;
    }
});

// Initialize
initBoard();
drawBoard();
