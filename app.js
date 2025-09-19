// Working 3D Snake Game - Complete Rewrite

class Snake3DGame {
    constructor() {
        console.log('Starting 3D Snake Game initialization...');
        
        // Game constants
        this.BOARD_SIZE = 20;
        this.GAME_SPEED = 400;
        
        // Game state
        this.gameState = 'title';
        this.score = 0;
        this.highScore = 0;
        this.lastMoveTime = 0;
        
        // Snake data
        this.snake = [];
        this.direction = { x: 0, z: 0 };
        this.nextDirection = { x: 0, z: 0 };
        this.food = { x: 0, z: 0 };
        
        // Three.js objects
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.snakeSegments = [];
        this.foodMesh = null;
        
        // Camera control
        this.cameraAngle = 0;
        this.cameraHeight = 20;
        this.cameraDistance = 30;
        
        // DOM elements
        this.titleScreen = document.getElementById('title-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.currentScoreEl = document.getElementById('current-score');
        this.highScoreEl = document.getElementById('high-score');
        this.finalScoreEl = document.getElementById('final-score');
        this.pauseIndicator = document.getElementById('pause-indicator');
        this.highScoreMessage = document.getElementById('high-score-message');
        this.gameCanvasContainer = document.getElementById('game-canvas');
        this.previewCanvasContainer = document.getElementById('preview-canvas');
        
        this.init();
    }
    
    init() {
        this.loadHighScore();
        this.setupEventListeners();
        this.updateHighScoreDisplay();
        this.createPreview();
        this.showScreen('title');
        console.log('3D Snake Game initialized successfully');
    }
    
    loadHighScore() {
        try {
            this.highScore = parseInt(sessionStorage.getItem('snake3DHighScore')) || 0;
        } catch (e) {
            this.highScore = 0;
        }
    }
    
    saveHighScore() {
        try {
            sessionStorage.setItem('snake3DHighScore', this.highScore.toString());
        } catch (e) {}
    }
    
    createPreview() {
        // Simple preview scene
        const previewScene = new THREE.Scene();
        const previewCamera = new THREE.PerspectiveCamera(75, 300/200, 0.1, 1000);
        const previewRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        previewRenderer.setSize(300, 200);
        previewRenderer.setClearColor(0x000033, 0.3);
        
        this.previewCanvasContainer.innerHTML = '';
        this.previewCanvasContainer.appendChild(previewRenderer.domElement);
        
        // Add light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        previewScene.add(light);
        previewScene.add(new THREE.AmbientLight(0x404040, 0.5));
        
        // Create preview snake
        for (let i = 0; i < 4; i++) {
            const geo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
            const mat = new THREE.MeshLambertMaterial({ color: i === 0 ? 0x00ff00 : 0x008800 });
            const cube = new THREE.Mesh(geo, mat);
            cube.position.set(i - 1.5, 0, 0);
            previewScene.add(cube);
        }
        
        previewCamera.position.set(3, 3, 3);
        previewCamera.lookAt(0, 0, 0);
        
        // Animate preview
        const animatePreview = () => {
            if (this.gameState === 'title') {
                previewScene.rotation.y += 0.01;
                previewRenderer.render(previewScene, previewCamera);
                requestAnimationFrame(animatePreview);
            }
        };
        animatePreview();
    }
    
    initGame3D() {
        console.log('Initializing 3D game scene...');
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000033);
        
        // Create camera
        const container = this.gameCanvasContainer;
        const rect = container.getBoundingClientRect();
        this.camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(rect.width, rect.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add to DOM
        container.innerHTML = '';
        container.appendChild(this.renderer.domElement);
        
        // Setup scene
        this.setupLights();
        this.createArena();
        this.setupCamera();
        this.setupMouseControls();
        
        console.log('3D scene initialized');
    }
    
    setupLights() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0x404040, 0.8);
        this.scene.add(ambient);
        
        // Directional light
        const directional = new THREE.DirectionalLight(0xffffff, 1.2);
        directional.position.set(10, 20, 10);
        directional.castShadow = true;
        directional.shadow.mapSize.width = 2048;
        directional.shadow.mapSize.height = 2048;
        directional.shadow.camera.near = 0.5;
        directional.shadow.camera.far = 50;
        directional.shadow.camera.left = -15;
        directional.shadow.camera.right = 15;
        directional.shadow.camera.top = 15;
        directional.shadow.camera.bottom = -15;
        this.scene.add(directional);
    }
    
    createArena() {
        // Ground
        const groundGeo = new THREE.PlaneGeometry(this.BOARD_SIZE, this.BOARD_SIZE);
        const groundMat = new THREE.MeshLambertMaterial({ color: 0x004400 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Grid helper
        const grid = new THREE.GridHelper(this.BOARD_SIZE, this.BOARD_SIZE, 0x006600, 0x003300);
        this.scene.add(grid);
        
        // Walls
        const wallHeight = 1;
        const wallMat = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const half = this.BOARD_SIZE / 2;
        
        // Create 4 walls
        const positions = [
            [0, wallHeight/2, half],     // front
            [0, wallHeight/2, -half],    // back  
            [half, wallHeight/2, 0],     // right
            [-half, wallHeight/2, 0]     // left
        ];
        
        positions.forEach(pos => {
            const wallGeo = new THREE.BoxGeometry(
                pos[0] === 0 ? this.BOARD_SIZE : 0.2,
                wallHeight,
                pos[2] === 0 ? this.BOARD_SIZE : 0.2
            );
            const wall = new THREE.Mesh(wallGeo, wallMat);
            wall.position.set(pos[0], pos[1], pos[2]);
            wall.castShadow = true;
            this.scene.add(wall);
        });
    }
    
    setupCamera() {
        const x = Math.sin(this.cameraAngle) * this.cameraDistance;
        const z = Math.cos(this.cameraAngle) * this.cameraDistance;
        this.camera.position.set(x, this.cameraHeight, z);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupMouseControls() {
        let mouseDown = false;
        let lastX = 0;
        
        this.renderer.domElement.addEventListener('mousedown', (e) => {
            mouseDown = true;
            lastX = e.clientX;
        });
        
        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (!mouseDown) return;
            const deltaX = e.clientX - lastX;
            this.cameraAngle -= deltaX * 0.01;
            this.setupCamera();
            lastX = e.clientX;
        });
        
        this.renderer.domElement.addEventListener('mouseup', () => {
            mouseDown = false;
        });
        
        this.renderer.domElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.cameraDistance += e.deltaY * 0.05;
            this.cameraDistance = Math.max(15, Math.min(50, this.cameraDistance));
            this.setupCamera();
        });
    }
    
    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
        document.getElementById('menu-btn').addEventListener('click', () => this.showScreen('title'));
        
        document.addEventListener('keydown', (e) => this.handleInput(e));
        
        // Prevent arrow key scrolling
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
    }
    
    handleInput(e) {
        if (this.gameState === 'title') {
            if (e.code === 'Space' || e.code === 'Enter') {
                this.startGame();
            }
        } else if (this.gameState === 'playing') {
            switch (e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    if (this.direction.z === 0) this.nextDirection = { x: 0, z: -1 };
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    if (this.direction.z === 0) this.nextDirection = { x: 0, z: 1 };
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    if (this.direction.x === 0) this.nextDirection = { x: -1, z: 0 };
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    if (this.direction.x === 0) this.nextDirection = { x: 1, z: 0 };
                    break;
                case 'Space':
                    this.togglePause();
                    break;
                case 'KeyR':
                    this.startGame();
                    break;
            }
        } else if (this.gameState === 'paused') {
            if (e.code === 'Space') this.togglePause();
            if (e.code === 'KeyR') this.startGame();
        } else if (this.gameState === 'gameOver') {
            if (e.code === 'Space' || e.code === 'Enter') this.startGame();
            if (e.code === 'Escape') this.showScreen('title');
        }
    }
    
    startGame() {
        console.log('Starting new game...');
        
        this.gameState = 'playing';
        this.score = 0;
        this.lastMoveTime = 0;
        
        // Reset snake
        this.snake = [
            { x: 0, z: 0 },
            { x: -1, z: 0 },
            { x: -2, z: 0 }
        ];
        this.direction = { x: 1, z: 0 };
        this.nextDirection = { x: 1, z: 0 };
        
        // Initialize 3D if needed
        if (!this.renderer) {
            this.initGame3D();
        }
        
        // Clear old snake
        this.clearSnake();
        
        // Create new snake
        this.createSnake();
        this.createFood();
        this.updateScore();
        this.showScreen('game');
        
        // Start game loop
        this.gameLoop();
        
        console.log('Game started with', this.snakeSegments.length, 'segments');
    }
    
    clearSnake() {
        this.snakeSegments.forEach(segment => {
            if (this.scene) this.scene.remove(segment);
        });
        this.snakeSegments = [];
    }
    
    createSnake() {
        this.snake.forEach((pos, i) => {
            const geo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
            const mat = new THREE.MeshLambertMaterial({
                color: i === 0 ? 0x00ff00 : 0x00cc00
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(pos.x, 0.45, pos.z);
            mesh.castShadow = true;
            
            this.snakeSegments.push(mesh);
            this.scene.add(mesh);
        });
    }
    
    createFood() {
        // Remove old food
        if (this.foodMesh) {
            this.scene.remove(this.foodMesh);
        }
        
        // Find empty position
        let pos;
        do {
            pos = {
                x: Math.floor(Math.random() * (this.BOARD_SIZE - 2)) - Math.floor((this.BOARD_SIZE - 2) / 2),
                z: Math.floor(Math.random() * (this.BOARD_SIZE - 2)) - Math.floor((this.BOARD_SIZE - 2) / 2)
            };
        } while (this.snake.some(s => s.x === pos.x && s.z === pos.z));
        
        this.food = pos;
        
        // Create food mesh
        const geo = new THREE.SphereGeometry(0.4, 12, 8);
        const mat = new THREE.MeshLambertMaterial({ 
            color: 0xff0000,
            emissive: 0x330000
        });
        this.foodMesh = new THREE.Mesh(geo, mat);
        this.foodMesh.position.set(this.food.x, 0.4, this.food.z);
        this.foodMesh.castShadow = true;
        
        this.scene.add(this.foodMesh);
    }
    
    gameLoop() {
        if (this.gameState !== 'playing') return;
        
        const now = performance.now();
        if (now - this.lastMoveTime >= this.GAME_SPEED) {
            this.updateGame();
            this.lastMoveTime = now;
        }
        
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateGame() {
        // Update direction
        this.direction = { ...this.nextDirection };
        
        // Move snake head
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.z += this.direction.z;
        
        // Check wall collision
        const half = Math.floor((this.BOARD_SIZE - 2) / 2);
        if (head.x < -half || head.x > half || head.z < -half || head.z > half) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.snake.some(s => s.x === head.x && s.z === head.z)) {
            this.gameOver();
            return;
        }
        
        // Add new head
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.z === this.food.z) {
            this.score += 10;
            this.updateScore();
            this.createFood();
            this.addSnakeSegment();
            this.GAME_SPEED = Math.max(200, this.GAME_SPEED - 3);
        } else {
            // Remove tail
            this.snake.pop();
            const tail = this.snakeSegments.pop();
            if (tail) this.scene.remove(tail);
        }
        
        // Update visual positions
        this.updateSnakeVisuals();
    }
    
    addSnakeSegment() {
        const geo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        const mat = new THREE.MeshLambertMaterial({ color: 0x00cc00 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        
        this.snakeSegments.push(mesh);
        this.scene.add(mesh);
    }
    
    updateSnakeVisuals() {
        this.snake.forEach((pos, i) => {
            if (this.snakeSegments[i]) {
                this.snakeSegments[i].position.set(pos.x, 0.45, pos.z);
                // Update head color
                if (i === 0) {
                    this.snakeSegments[i].material.color.setHex(0x00ff00);
                }
            }
        });
    }
    
    render() {
        if (!this.renderer || !this.scene || !this.camera) return;
        
        // Animate food
        if (this.foodMesh) {
            this.foodMesh.rotation.y += 0.1;
            this.foodMesh.position.y = 0.4 + Math.sin(Date.now() * 0.005) * 0.1;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.pauseIndicator.classList.remove('hidden');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.pauseIndicator.classList.add('hidden');
            this.lastMoveTime = performance.now();
            this.gameLoop();
        }
    }
    
    updateScore() {
        this.currentScoreEl.textContent = this.score;
    }
    
    updateHighScoreDisplay() {
        this.highScoreEl.textContent = this.highScore;
    }
    
    gameOver() {
        console.log('Game Over! Score:', this.score);
        this.gameState = 'gameOver';
        
        // Check high score
        let newHighScore = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            this.updateHighScoreDisplay();
            newHighScore = true;
        }
        
        this.finalScoreEl.textContent = this.score;
        
        if (newHighScore) {
            this.highScoreMessage.classList.remove('hidden');
        } else {
            this.highScoreMessage.classList.add('hidden');
        }
        
        setTimeout(() => this.showScreen('gameOver'), 1000);
    }
    
    showScreen(screen) {
        // Hide all screens
        this.titleScreen.classList.add('hidden');
        this.gameScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.pauseIndicator.classList.add('hidden');
        
        // Show target screen
        switch (screen) {
            case 'title':
                this.titleScreen.classList.remove('hidden');
                this.gameState = 'title';
                this.GAME_SPEED = 400;
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking Three.js...');
    
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded!');
        alert('Three.js failed to load. Please refresh the page.');
        return;
    }
    
    if (!window.WebGLRenderingContext) {
        console.error('WebGL not supported!');
        alert('WebGL not supported. Please use a modern browser.');
        return;
    }
    
    try {
        window.game = new Snake3DGame();
        console.log('3D Snake Game ready!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        alert('Failed to start game: ' + error.message);
    }
});