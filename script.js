const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("best");
const startBtn = document.getElementById("start");
const playPauseBtnTop = document.getElementById("playPauseBtnTop");
const pauseOverlay = document.getElementById("pauseOverlay");
const continueBtn = document.getElementById("continueBtn");

let size = 4;
let tiles = [];
let paused = true;
let gameStarted = false;
let gameOver = false;
let currentScore = 0;

function updateButtonVisibility() {
    if (gameOver || !gameStarted) {
        startBtn.style.display = 'block';
        playPauseBtnTop.style.display = 'none';
        pauseOverlay.style.display = 'none';
    } else if (paused) {
        startBtn.style.display = 'none';
        playPauseBtnTop.style.display = 'flex';
        playPauseBtnTop.classList.remove('pause-icon');
        playPauseBtnTop.classList.add('play-icon');
        playPauseBtnTop.querySelector('span').innerHTML = '▶';
        pauseOverlay.style.display = 'flex';
    } else {
        startBtn.style.display = 'none';
        playPauseBtnTop.style.display = 'flex';
        playPauseBtnTop.classList.remove('play-icon');
        playPauseBtnTop.classList.add('pause-icon');
        playPauseBtnTop.querySelector('span').innerHTML = '⏸︎';
        pauseOverlay.style.display = 'none';
    }
}

function setupNewGame() {
    startBtn.classList.add('animate');
    
    setTimeout(() => {
        grid.innerHTML = '';
        tiles = [];
        for (let i = 0; i < size * size; i++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.dataset.val = '';
            tile.textContent = '';
            grid.appendChild(tile);
            tiles.push(tile);
        }
        
        setTimeout(() => {
            grid.classList.add('show');
            addRandomTile();
            setTimeout(() => {
                addRandomTile();
            }, 150);
        }, 100);
        
        updateScore(0);
        updateTileStyles();

        paused = false;
        gameStarted = true;
        gameOver = false;
        updateButtonVisibility();
        
        setTimeout(() => {
            startBtn.classList.remove('animate');
        }, 500);
    }, 500);
}

function continueGame() {
    if (gameStarted && !gameOver) {
        paused = false;
        updateButtonVisibility();
    }
}

function pauseGame() {
    if (gameStarted && !gameOver) {
        paused = true;
        updateButtonVisibility();
    }
}

function togglePause() {
    if (gameStarted && !gameOver) {
        paused ? continueGame() : pauseGame();
    }
}

function addRandomTile() {
    const empty = tiles.filter(t => t.textContent === '');
    if (empty.length === 0) return;
    const tile = empty[Math.floor(Math.random() * empty.length)];
    tile.textContent = Math.random() < 0.9 ? 2 : 4;
    tile.classList.add('appear');
    setTimeout(() => {
        tile.classList.remove('appear');
    }, 300);
    updateTileStyles();
}

function updateTileStyles() {
    tiles.forEach(tile => {
        tile.dataset.val = tile.textContent || '';
    });
}

function merge(line) {
    let result = [];
    for (let i = 0; i < line.length; i++) {
        if (line[i] === null) continue;
        if (line[i] === line[i + 1]) {
            result.push(line[i] * 2);
            updateScore(currentScore + line[i] * 2);
            i++;
        } else {
            result.push(line[i]);
        }
    }
    while (result.length < size) result.push(null);
    return result;
}

function move(dir) {
    if (paused || gameOver) return;
    let moved = false;

    if (dir === 'up' || dir === 'down') {
        for (let col = 0; col < size; col++) {
            let column = [];
            for (let row = 0; row < size; row++) {
                const i = row * size + col;
                const val = parseInt(tiles[i].textContent) || null;
                if (val) column.push(val);
            }
            if (dir === 'down') column.reverse();
            const merged = merge(column);
            if (dir === 'down') merged.reverse();
            for (let row = 0; row < size; row++) {
                const i = row * size + col;
                const prev = tiles[i].textContent;
                tiles[i].textContent = merged[row] || '';
                if (prev !== tiles[i].textContent && tiles[i].textContent !== '') {
                    moved = true;
                    tiles[i].classList.add('merge');
                    setTimeout(() => {
                        tiles[i].classList.remove('merge');
                    }, 300);
                }
            }
        }
    } else {
        for (let row = 0; row < size; row++) {
            let line = [];
            for (let col = 0; col < size; col++) {
                const i = row * size + col;
                const val = parseInt(tiles[i].textContent) || null;
                if (val) line.push(val);
            }
            if (dir === 'right') line.reverse();
            const merged = merge(line);
            if (dir === 'right') merged.reverse();
            for (let col = 0; col < size; col++) {
                const i = row * size + col;
                const prev = tiles[i].textContent;
                tiles[i].textContent = merged[col] || '';
                if (prev !== tiles[i].textContent && tiles[i].textContent !== '') {
                    moved = true;
                    tiles[i].classList.add('merge');
                    setTimeout(() => {
                        tiles[i].classList.remove('merge');
                    }, 300);
                }
            }
        }
    }

    if (moved) {
        setTimeout(() => {
            addRandomTile();
            updateTileStyles();
            if (isGameOver()) {
                gameOver = true;
                paused = true;
                gameStarted = false;
                updateButtonVisibility();
            }
        }, 300);
    }
}

function isGameOver() {
    const copy = tiles.map(t => parseInt(t.textContent) || 0);
    for (let i = 0; i < size * size; i++) {
        if (copy[i] === 0) return false;
        const x = i % size;
        const y = Math.floor(i / size);
        if (x < size - 1 && copy[i] === copy[i + 1]) return false;
        if (y < size - 1 && copy[i] === copy[i + size]) return false;
    }
    return true;
}

function updateScore(score = 0) {
    currentScore = score;
    scoreDisplay.textContent = currentScore;
    const best = Math.max(score, parseInt(localStorage.getItem("best") || 0));
    localStorage.setItem("best", best);
    bestDisplay.textContent = best;
}

// Keyboard handling
document.addEventListener("keydown", e => {
    if (e.key === " ") { // Space for pause
        togglePause();
        e.preventDefault();
        return;
    }
    
    if (paused || gameOver) return;
    
    switch(e.key) {
        case "ArrowUp":
        case "w":
        case "W":
            move("up");
            break;
        case "ArrowDown":
        case "s":
        case "S":
            move("down");
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            move("left");
            break;
        case "ArrowRight":
        case "d":
        case "D":
            move("right");
            break;
    }
});

// Swipe handling
let startX, startY;
document.addEventListener("touchstart", e => {
    if (paused || gameOver) return;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
});

document.addEventListener("touchend", e => {
    if (paused || gameOver) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) move("right");
        else if (dx < -30) move("left");
    } else {
        if (dy > 30) move("down");
        else if (dy < -30) move("up");
    }
});

// Event listeners for buttons
startBtn.addEventListener('click', () => {
    setupNewGame();
});

playPauseBtnTop.addEventListener('click', togglePause);

continueBtn.addEventListener('click', continueGame);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateScore(0);
    updateButtonVisibility();
});