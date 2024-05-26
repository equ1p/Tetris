import { Tetris } from "./tetris.js";
import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, convertPositionToIndex } from "./utilities.js";

let requestId;
let timeoutId;
const tetris = new Tetris();
const cells = document.querySelectorAll('.grid>div');
const nextCells = document.querySelectorAll('.next-grid>div');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const gameOverMenu = document.getElementById('gameOverMenu');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
restartButton.addEventListener('click', restartGame);

function startGame() {
    if (tetris.isGameOver) {
        tetris.init();
        tetris.isGameOver = false;
        updateScore();
        updateNextTetromino();
    }
    hideGameOverMenu();
    startLoop();
    document.addEventListener('keydown', onKeydown);
}

function pauseGame() {
    stopLoop();
    document.removeEventListener('keydown', onKeydown);
}

function restartGame() {
    gameOverMenu.style.display = 'none';
    tetris.init();
    tetris.isGameOver = false;
    updateScore();
    updateNextTetromino();
    startLoop();
    document.addEventListener('keydown', onKeydown);
}

function initKeydown() {
    document.addEventListener('keydown', onKeydown);
}

function onKeydown(event) {
    switch(event.key) {
        case 'ArrowUp':
            rotate();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case ' ':
            dropDown();
            break;
        default:
            break;
    }
}

function moveDown() {
    tetris.moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();

    if(tetris.isGameOver) {
        gameOver();
    }
}

function moveLeft() {
    tetris.moveTetrominoLeft();
    draw();
}

function moveRight() {
    tetris.moveTetrominoRight();
    draw();
}

function rotate() {
    tetris.rotateTetromino();
    draw();
}

function dropDown() {
    tetris.dropTetrominoDown();
    draw();
    stopLoop();
    startLoop();

    if(tetris.isGameOver) {
        gameOver();
    }
}

function startLoop() {
    timeoutId = setTimeout(() => requestId = requestAnimationFrame(moveDown), 700);
}

function stopLoop() {
    cancelAnimationFrame(requestId);
    clearTimeout(timeoutId);
}

function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayfield();
    drawTetromino();
    drawGhostTetromino();
    updateScore();
    updateNextTetromino();
}

function drawPlayfield() {
    for(let row = 0; row < PLAYFIELD_ROWS; row++) {
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if(!tetris.playfield[row][column]) continue;
            const name = tetris.playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino() {
    const name = tetris.tetromino.name;
    const tetrominoMatrixSize = tetris.tetromino.matrix.length;
    for(let row = 0; row < tetrominoMatrixSize; row++) {
        for(let column = 0; column < tetrominoMatrixSize; column++) {
            if(!tetris.tetromino.matrix[row][column]) continue;
            if(tetris.tetromino.row + row < 0) continue;
            const cellIndex = convertPositionToIndex(tetris.tetromino.row + row, tetris.tetromino.column + column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawGhostTetromino() {
    const tetrominoMatrixSize = tetris.tetromino.matrix.length;
    for(let row = 0; row < tetrominoMatrixSize; row++) {
        for(let column = 0; column < tetrominoMatrixSize; column++) {
            if(!tetris.tetromino.matrix[row][column]) continue;
            if(tetris.tetromino.ghostRow + row < 0) continue;
            const cellIndex = convertPositionToIndex(tetris.tetromino.ghostRow + row, tetris.tetromino.ghostColumn + column);
            cells[cellIndex].classList.add('ghost');
        }
    }
}

function gameOver() {
    stopLoop();
    document.removeEventListener('keydown', onKeydown);
    finalScore.textContent = tetris.score;
    gameOverMenu.style.display = 'block';
    tetris.score = 0;  // Reset the score after game over
    updateScore();     // Update the score display
}

function updateScore() {
    document.getElementById('score').textContent = tetris.score;
}

function updateNextTetromino() {
    nextCells.forEach(cell => cell.removeAttribute('class'));
    const tetromino = tetris.nextTetromino;
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;
    for(let row = 0; row < tetrominoMatrixSize; row++) {
        for(let column = 0; column < tetrominoMatrixSize; column++) {
            if(!tetromino.matrix[row][column]) continue;
            const cellIndex = row * 4 + column;
            nextCells[cellIndex].classList.add(name);
        }
    }
}

function hideGameOverMenu() {
    gameOverMenu.style.display = 'none';
}
