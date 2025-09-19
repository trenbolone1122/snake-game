// 3D Snake Game Implementation using Three.js - FIXED VERSION

class Snake3DGame {
    constructor() {
        // Game constants
        this.GRID_SIZE = 1;
        this.BOARD_SIZE = 15;
        this.GAME_SPEED = 300;
        
        // Game state
        this.gameState = 'title';
        this.score = 0;
        this.highScore = 0;
        this.lastMoveTime = 0;
        this.gameLoopId = null;
        this.previewLoopId = null;
        
        // Snake (using x,z coordinates for 3D movement)
        this.snake = [];
        this.direction = { x: 0, z: 0 };
        this.nextDirection = { x: 0, z: 0 };
        
        // Food
        this.food = { x: 0, z: 0 };
        
        // Three.js objects
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.previewRenderer = null;
        this.previewScene = null;
        this.previewCamera = null;
        this.snakeSegments = [];
        this.foodMesh = null;
        
        // Camera controls - FIXED INITIAL POSITION
        this.mouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cameraAngleX = -0.8; // Better initial angle
        this.cameraAngleY = 0;
        this.cameraDistance = 25; // Increased distance
        
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
        
        console.log('3D Snake Game initializing...');
        this.initializeGame();
    }
    
    initializeGame() {
        this.loadHighScore();
        this.setupEventListeners();
        this.updateHighScoreDisplay();
        
        // Initialize preview immediately
        setTimeout(() => this.initPreview(), 100);
        this.showScreen('title');
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
    
    initPreview() {
        try {
            console.log('Initializing 3D preview...');
            // Create preview 3D scene
            this.previewScene = new THREE.Scene();
            this.previewCamera = new THREE.PerspectiveCamera(75, 300/200, 0.1, 1000);
            this.previewRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.previewRenderer.setSize(300, 200);
            this.previewRenderer.setClearColor(0x001122, 0.5);
            
            // Clear any existing canvas
            this.previewCanvasContainer.innerHTML = '';
            this.previewCanvasContainer.appendChild(this.previewRenderer.domElement);
            
            // IMPROVED LIGHTING
            const previewLight = new THREE.DirectionalLight(0xffffff, 1.2);
            previewLight.position.set(5, 8, 5);
            this.previewScene.add(previewLight);
            
            const previewAmbient = new THREE.AmbientLight(0x404040, 0.6);
            this.previewScene.add(previewAmbient);
            
            // Create preview snake with better visibility
            const previewSnakeSegments = [];
            for (let i = 0; i < 5; i++) {
                const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
                const material = new THREE.MeshLambertMaterial({ 
                    color: i === 0 ? 0x00ff00 : 0x00aa00 
                });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(i * 1.0 - 2, 0, 0);
                previewSnakeSegments.push(cube);
                this.previewScene.add(cube);
            }
            
            // Better camera positioning
            this.previewCamera.position.set(4, 4, 4);
            this.previewCamera.lookAt(0, 0, 0);
            
            console.log('Preview initialized successfully');
            this.animatePreview();
        } catch (error) {
            console.error('Preview initialization failed:', error);
        }
    }
    
    animatePreview() {
        const animate = () => {
            if (this.gameState === 'title' && this.previewRenderer && this.previewScene) {
                this.previewScene.rotation.y += 0.015;
                this.previewRenderer.render(this.previewScene, this.previewCamera);
                this.previewLoopId = requestAnimationFrame(animate);
            }
        };
        animate();
    }
    
    initGame3D() {
        try {
            console.log('Initializing main 3D scene...');
            
            // Create main 3D scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x001122);
            
            // FIXED CAMERA SETUP
            const container = this.gameCanvasContainer;
            const rect = container.getBoundingClientRect();
            this.camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000);
            
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(rect.width, rect.height);
            this.renderer.setClearColor(0x001122);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            // Clear container and add renderer
            container.innerHTML = '';
            container.appendChild(this.renderer.domElement);
            
            this.setupLighting();
            this.createArena();
            this.updateCamera();
            this.setupMouseControls();
            
            console.log('Main 3D scene initialized successfully');
        } catch (error) {
            console.error('3D scene initialization failed:', error);
        }
    }
    
    setupLighting() {
        // ENHANCED LIGHTING SETUP
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // Increased ambient
        this.scene.add(ambientLight);
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(15, 25, 15);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        this.scene.add(directionalLight);
        
        // Snake head light
        this.snakeLight = new THREE.PointLight(0x00ffff, 0.8, 15);
        this.snakeLight.position.set(0, 3, 0);
        this.scene.add(this.snakeLight);
        
        console.log('Lighting setup complete');
    }
    
    createArena() {
        // Ground with grid pattern
        const groundGeometry = new THREE.PlaneGeometry(this.BOARD_SIZE, this.BOARD_SIZE, 15, 15);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x003366,
            wireframe: false
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Grid lines for better visibility
        const gridHelper = new THREE.GridHelper(this.BOARD_SIZE, this.BOARD_SIZE, 0x004488, 0x002244);
        gridHelper.position.y = 0.01;
        this.scene.add(gridHelper);
        
        // Walls
        const wallHeight = 2;
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x0066cc });
        
        // Create 4 walls with correct positioning
        const halfBoard = this.BOARD_SIZE / 2;
        const walls = [
            { pos: [0, wallHeight/2, halfBoard + 0.1], size: [this.BOARD_SIZE + 0.2, wallHeight, 0.2] },
            { pos: [0, wallHeight/2, -(halfBoard + 0.1)], size: [this.BOARD_SIZE + 0.2, wallHeight, 0.2] },
            { pos: [halfBoard + 0.1, wallHeight/2, 0], size: [0.2, wallHeight, this.BOARD_SIZE] },
            { pos: [-(halfBoard + 0.1), wallHeight/2, 0], size: [0.2, wallHeight, this.BOARD_SIZE] }
        ];
        
        walls.forEach((wall, index) => {
            const wallGeometry = new THREE.BoxGeometry(...wall.size);
            const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
            wallMesh.position.set(...wall.pos);
            wallMesh.castShadow = true;
            wallMesh.receiveShadow = true;
            this.scene.add(wallMesh);
        });
        
        console.log('Arena created');
    }
    
    setupMouseControls() {
        const canvas = this.renderer.domElement;
        
        canvas.addEventListener('mousedown', (e) => {
            this.mouseDown = true;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!this.mouseDown) return;
            
            const deltaX = e.clientX - this.mouseX;
            const deltaY = e.clientY - this.mouseY;
            
            this.cameraAngleY -= deltaX * 0.01;
            this.cameraAngleX -= deltaY * 0.01;
            this.cameraAngleX = Math.max(-Math.PI/2 + 0.1, Math.min(-0.1, this.cameraAngleX)); // Keep camera above ground
            
            this.updateCamera();
            
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        canvas.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });
        
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.cameraDistance += e.deltaY * 0.02;
            this.cameraDistance = Math.max(15, Math.min(50, this.cameraDistance));
            this.updateCamera();
        });
    }
    
    updateCamera() {
        const x = Math.sin(this.cameraAngleY) * Math.cos(this.cameraAngleX) * this.cameraDistance;
        const y = Math.sin(this.cameraAngleX) * this.cameraDistance;
        const z = Math.cos(this.cameraAngleY) * Math.cos(this.cameraAngleX) * this.cameraDistance;
        
        this.camera.position.set(x, -y, z); // Negative y for proper orientation
        this.camera.lookAt(0, 0, 0);
        
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
        document.getElementById('menu-btn').addEventListener('click', () => this.showScreen('title'));
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        document.addEventListener('keydown', (e) => {
            if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code) > -1) {
                e.preventDefault();
            }
        }, false);
        
        window.addEventListener('resize', () => {
            if (this.renderer) {
                const container = this.gameCanvasContainer;
                const rect = container.getBoundingClientRect();
                this.camera.aspect = rect.width / rect.height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(rect.width, rect.height);
            }
        });
    }
    
    handleKeyPress(e) {
        const key = e.code;
        
        if (this.gameState === 'title') {
            if (key === 'Space' || key === 'Enter') this.startGame();
        } else if (this.gameState === 'playing') {
            if (key === 'ArrowUp' || key === 'KeyW') {
                if (this.direction.z === 0) this.nextDirection = { x: 0, z: -1 };
            } else if (key === 'ArrowDown' || key === 'KeyS') {
                if (this.direction.z === 0) this.nextDirection = { x: 0, z: 1 };
            } else if (key === 'ArrowLeft' || key === 'KeyA') {
                if (this.direction.x === 0) this.nextDirection = { x: -1, z: 0 };
            } else if (key === 'ArrowRight' || key === 'KeyD') {
                if (this.direction.x === 0) this.nextDirection = { x: 1, z: 0 };
            } else if (key === 'Space') {
                this.togglePause();
            } else if (key === 'KeyR') {
                this.startGame();
            }
        } else if (this.gameState === 'paused') {
            if (key === 'Space') this.togglePause();
            else if (key === 'KeyR') this.startGame();
        } else if (this.gameState === 'gameOver') {
            if (key === 'Space' || key === 'Enter') this.startGame();
            else if (key === 'KeyR') this.startGame();
            else if (key === 'Escape') this.showScreen('title');
        }
    }
    
    startGame() {
        console.log('Starting 3D game...');
        this.gameState = 'playing';
        this.score = 0;
        
        // FIXED INITIAL SNAKE POSITION
        this.snake = [
            { x: 0, z: 0 }, 
            { x: -1, z: 0 }, 
            { x: -2, z: 0 }
        ];
        this.direction = { x: 1, z: 0 };
        this.nextDirection = { x: 1, z: 0 };
        this.lastMoveTime = 0;
        
        // Initialize 3D scene if needed
        if (!this.renderer) {
            this.initGame3D();
        }
        
        // Clear existing snake segments
        this.snakeSegments.forEach(segment => {
            if (this.scene) this.scene.remove(segment);
        });
        this.snakeSegments = [];
        
        // Create initial snake
        this.createSnakeSegments();
        this.generateFood();
        this.updateScore();
        this.showScreen('game');
        
        if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
        this.gameLoop();
        
        console.log('Game started, snake segments:', this.snakeSegments.length);
    }
    
    createSnakeSegments() {
        console.log('Creating snake segments for positions:', this.snake);
        
        this.snake.forEach((segment, index) => {
            const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
            const material = new THREE.MeshLambertMaterial({ 
                color: index === 0 ? 0x00ff00 : 0x00aa00
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(segment.x, 0.5, segment.z); // Y = 0.5 to sit on ground
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            this.snakeSegments.push(mesh);
            this.scene.add(mesh);
        });
        
        console.log('Created', this.snakeSegments.length, 'snake segments');
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
        
        this.direction = { ...this.nextDirection };
        
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.z += this.direction.z;
        
        // Wall collision (fixed bounds)
        const halfBoard = Math.floor(this.BOARD_SIZE / 2);
        if (head.x < -halfBoard || head.x >= halfBoard || 
            head.z < -halfBoard || head.z >= halfBoard) {
            this.gameOver();
            return;
        }
        
        // Self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.z === segment.z) {
                this.gameOver();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // Food collision
        if (head.x === this.food.x && head.z === this.food.z) {
            this.score += 10;
            this.updateScore();
            this.generateFood();
            this.addSnakeSegment();
            this.GAME_SPEED = Math.max(150, this.GAME_SPEED - 5);
        } else {
            this.snake.pop();
            const tailSegment = this.snakeSegments.pop();
            if (tailSegment) this.scene.remove(tailSegment);
        }
        
        this.updateSnakePositions();
        
        // Update snake light
        if (this.snakeLight) {
            this.snakeLight.position.set(head.x, 2, head.z);
        }
    }
    
    addSnakeSegment() {
        const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        const material = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.snakeSegments.push(mesh);
        this.scene.add(mesh);
    }
    
    updateSnakePositions() {
        this.snake.forEach((segment, index) => {
            if (this.snakeSegments[index]) {
                this.snakeSegments[index].position.set(segment.x, 0.5, segment.z);
                // Update colors
                const color = index === 0 ? 0x00ff00 : 0x00aa00;
                this.snakeSegments[index].material.color.setHex(color);
            }
        });
    }
    
    generateFood() {
        const halfBoard = Math.floor(this.BOARD_SIZE / 2);
        let foodPosition;
        
        do {
            foodPosition = {
                x: Math.floor(Math.random() * this.BOARD_SIZE) - halfBoard,
                z: Math.floor(Math.random() * this.BOARD_SIZE) - halfBoard
            };
        } while (this.snake.some(segment => 
            segment.x === foodPosition.x && segment.z === foodPosition.z
        ));
        
        this.food = foodPosition;
        
        // Remove old food
        if (this.foodMesh) this.scene.remove(this.foodMesh);
        
        // Create new food
        const geometry = new THREE.SphereGeometry(0.4, 16, 12);
        const material = new THREE.MeshLambertMaterial({ 
            color: 0xff4444,
            emissive: 0x330000
        });
        this.foodMesh = new THREE.Mesh(geometry, material);
        this.foodMesh.position.set(this.food.x, 0.5, this.food.z);
        this.foodMesh.castShadow = true;
        this.scene.add(this.foodMesh);
        
        console.log('Food generated at:', this.food);
    }
    
    render() {
        if (this.renderer && this.scene && this.camera && this.gameState !== 'title') {
            // Animate food
            if (this.foodMesh) {
                this.foodMesh.rotation.y += 0.05;
                this.foodMesh.position.y = 0.5 + Math.sin(Date.now() * 0.003) * 0.1;
            }
            
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    updateScore() {
        this.currentScoreEl.textContent = this.score;
    }
    
    updateHighScoreDisplay() {
        this.highScoreEl.textContent = this.highScore;
    }
    
    gameOver() {
        console.log('Game over!');
        this.gameState = 'gameOver';
        
        let isNewHighScore = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            this.updateHighScoreDisplay();
            isNewHighScore = true;
        }
        
        this.finalScoreEl.textContent = this.score;
        
        if (isNewHighScore) {
            this.highScoreMessage.classList.remove('hidden');
        } else {
            this.highScoreMessage.classList.add('hidden');
        }
        
        setTimeout(() => this.showScreen('gameOver'), 1500);
    }
    
    showScreen(screen) {
        this.titleScreen.classList.add('hidden');
        this.gameScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.pauseIndicator.classList.add('hidden');
        
        switch (screen) {
            case 'title':
                this.titleScreen.classList.remove('hidden');
                this.gameState = 'title';
                this.GAME_SPEED = 300;
                if (this.previewLoopId) cancelAnimationFrame(this.previewLoopId);
                this.animatePreview();
                break;
            case 'game':
                this.gameScreen.classList.remove('hidden');
                if (this.previewLoopId) cancelAnimationFrame(this.previewLoopId);
                break;
            case 'gameOver':
                this.gameOverScreen.classList.remove('hidden');
                break;
        }
    }
}

// Initialize 3D Snake Game with error handling
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    
    if (!window.THREE) {
        console.error('Three.js not loaded!');
        alert('Three.js library failed to load. Please refresh the page.');
        return;
    }
    
    if (!window.WebGLRenderingContext) {
        console.error('WebGL not supported!');
        alert('Your browser does not support WebGL. Please use a modern browser to play this 3D game.');
        return;
    }
    
    try {
        const game = new Snake3DGame();
        window.snakeGame = game; // For debugging
        console.log('3D Snake Game initialized successfully!');
    } catch (error) {
        console.error('Game initialization failed:', error);
        alert('Failed to initialize the game. Please refresh the page.');
    }
});