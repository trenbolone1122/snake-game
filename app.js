// Snake Game Implementation

class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game constants
        this.GRID_SIZE = 20;
        this.CANVAS_SIZE = 400;
        this.GAME_SPEED = 200; // milliseconds between moves
        
        // Game state
        this.gameState = 'title'; // title, playing, paused, gameOver
        this.score = 0;
        this.highScore = 0;
        this.lastMoveTime = 0;
        this.gameLoopId = null;
        
        // Snake
        this.snake = [];
        this.direction = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        
        // Food
        this.food = { x: 0, y: 0 };
        
        // DOM elements
        this.titleScreen = document.getElementById('title-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.currentScoreEl = document.getElementById('current-score');
        this.highScoreEl = document.getElementById('high-score');
        this.finalScoreEl = document.getElementById('final-score');
        this.pauseIndicator = document.getElementById('pause-indicator');
        this.highScoreMessage = document.getElementById('high-score-message');
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.loadHighScore();
        this.setupEventListeners();
        this.updateHighScoreDisplay();
        this.showScreen('title');
    }
    
    loadHighScore() {
        try {
            this.highScore = parseInt(sessionStorage.getItem('snakeHighScore')) || 0;
        } catch (e) {
            this.highScore = 0;
        }
    }
    
    saveHighScore() {
        try {
            sessionStorage.setItem('snakeHighScore', this.highScore.toString());
        } catch (e) {
            // Session storage not available
        }
    }
    
    setupEventListeners() {
        // Button events
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('menu-btn').addEventListener('click', () => {
            this.showScreen('title');
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Prevent default scrolling for arrow keys
        document.addEventListener('keydown', (e) => {
            if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code) > -1) {
                e.preventDefault();
            }
        }, false);
    }
    
    handleKeyPress(e) {
        const key = e.code;
        
        if (this.gameState === 'title') {
            if (key === 'Space' || key === 'Enter') {
                this.startGame();
            }
        } else if (this.gameState === 'playing') {
            // Movement keys
            if (key === 'ArrowUp' || key === 'KeyW') {
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: -1 };
                }
            } else if (key === 'ArrowDown' || key === 'KeyS') {
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: 1 };
                }
            } else if (key === 'ArrowLeft' || key === 'KeyA') {
                if (this.direction.x === 0) {
                    this.nextDirection = { x: -1, y: 0 };
                }
            } else if (key === 'ArrowRight' || key === 'KeyD') {
                if (this.direction.x === 0) {
                    this.nextDirection = { x: 1, y: 0 };
                }
            } else if (key === 'Space') {
                this.togglePause();
            } else if (key === 'KeyR') {
                this.startGame();
            }
        } else if (this.gameState === 'paused') {
            if (key === 'Space') {
                this.togglePause();
            } else if (key === 'KeyR') {
                this.startGame();
            }
        } else if (this.gameState === 'gameOver') {
            if (key === 'Space' || key === 'Enter') {
                this.startGame();
            } else if (key === 'KeyR') {
                this.startGame();
            } else if (key === 'Escape') {
                this.showScreen('title');
            }
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.lastMoveTime = 0;
        
        this.generateFood();
        this.updateScore();
        this.showScreen('game');
        
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }
        this.gameLoop();
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.pauseIndicator.classList.remove('hidden');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.pauseIndicator.classList.add('hidden');
            this.lastMoveTime = performance.now();
        }
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameState === 'playing') {
            if (currentTime - this.lastMoveTime >= this.GAME_SPEED) {
                this.update();
                this.lastMoveTime = currentTime;
            }
        }
        
        this.render();
        
        if (this.gameState !== 'gameOver' && this.gameState !== 'title') {
            this.gameLoopId = requestAnimationFrame((time) => this.gameLoop(time));
        }
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Update direction
        this.direction = { ...this.nextDirection };
        
        // Move snake
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // Check wall collisions
        const gridWidth = this.CANVAS_SIZE / this.GRID_SIZE;
        const gridHeight = this.CANVAS_SIZE / this.GRID_SIZE;
        
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.generateFood();
            
            // Increase speed slightly
            this.GAME_SPEED = Math.max(80, this.GAME_SPEED - 2);
        } else {
            this.snake.pop();
        }
    }
    
    generateFood() {
        const gridWidth = this.CANVAS_SIZE / this.GRID_SIZE;
        const gridHeight = this.CANVAS_SIZE / this.GRID_SIZE;
        
        let foodPosition;
        do {
            foodPosition = {
                x: Math.floor(Math.random() * gridWidth),
                y: Math.floor(Math.random() * gridHeight)
            };
        } while (this.snake.some(segment => 
            segment.x === foodPosition.x && segment.y === foodPosition.y
        ));
        
        this.food = foodPosition;
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
        
        if (this.gameState === 'title') return;
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#4ade80';
            } else {
                // Body
                this.ctx.fillStyle = '#22c55e';
            }
            
            this.ctx.fillRect(
                segment.x * this.GRID_SIZE + 1,
                segment.y * this.GRID_SIZE + 1,
                this.GRID_SIZE - 2,
                this.GRID_SIZE - 2
            );
        });
        
        // Draw food
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(
            this.food.x * this.GRID_SIZE + 2,
            this.food.y * this.GRID_SIZE + 2,
            this.GRID_SIZE - 4,
            this.GRID_SIZE - 4
        );
    }
    
    updateScore() {
        this.currentScoreEl.textContent = this.score;
    }
    
    updateHighScoreDisplay() {
        this.highScoreEl.textContent = this.highScore;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        
        // Check for high score
        let isNewHighScore = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            this.updateHighScoreDisplay();
            isNewHighScore = true;
        }
        
        // Update final score display
        this.finalScoreEl.textContent = this.score;
        
        // Show/hide high score message
        if (isNewHighScore) {
            this.highScoreMessage.classList.remove('hidden');
        } else {
            this.highScoreMessage.classList.add('hidden');
        }
        
        // Show game over screen after a brief delay
        setTimeout(() => {
            this.showScreen('gameOver');
        }, 1000);
    }
    
    showScreen(screen) {
        // Hide all screens
        this.titleScreen.classList.add('hidden');
        this.gameScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.pauseIndicator.classList.add('hidden');
        
        // Show requested screen
        switch (screen) {
            case 'title':
                this.titleScreen.classList.remove('hidden');
                this.gameState = 'title';
                // Reset game speed
                this.GAME_SPEED = 200;
                break;
            case 'game':
                this.gameScreen.classList.remove('hidden');
                break;
            case 'gameOver':
                this.gameOverScreen.classList.remove('hidden');
                break;
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});