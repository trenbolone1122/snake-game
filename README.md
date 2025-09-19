# 🐍 3D Snake Game

A stunning **3D Snake game** built with **Three.js**, **HTML5**, **CSS3**, and **JavaScript**. Experience the classic arcade game in a fully immersive 3D environment with modern graphics and smooth animations!

## 🎮 Play Now

**[Play the 3D Game](https://trenbolone1122.github.io/snake-game/)**

## ✨ 3D Features

- **Full 3D Environment**: Navigate through a stunning 3D arena with proper depth and perspective
- **Interactive Camera**: Mouse controls to rotate and zoom the camera for optimal viewing angles
- **3D Snake**: Volumetric snake segments with realistic lighting and shadows
- **Dynamic Lighting**: Point light following the snake head plus environmental lighting
- **3D Food Items**: Rotating, glowing spherical food with animated floating effects
- **Immersive Arena**: 3D walls, textured ground plane, and grid system
- **WebGL Rendering**: Hardware-accelerated graphics for smooth 60fps gameplay
- **3D Preview**: Rotating 3D snake preview on the title screen

## 🎯 How to Play

1. **Start**: Click "Start 3D Game" or press any key from the title screen
2. **Move**: Use arrow keys or WASD to control the snake in 3D space
3. **Camera**: Drag mouse to rotate camera view, scroll to zoom in/out
4. **Eat**: Guide the snake to eat the glowing red food spheres
5. **Grow**: Each food eaten makes the snake longer and increases your score
6. **Avoid**: Don't hit the walls or the snake's own body
7. **Win**: Try to beat your high score in the 3D environment!

## 🎮 Controls

| Key | Action |
|-----|--------|
| ↑ or W | Move Forward (North) |
| ↓ or S | Move Backward (South) |
| ← or A | Move Left (West) |
| → or D | Move Right (East) |
| **Mouse Drag** | **Rotate Camera** |
| **Mouse Scroll** | **Zoom In/Out** |
| Space | Pause/Unpause |
| R | Restart Game |
| Enter | Start Game / Play Again |
| Escape | Return to Main Menu |

## 🏗️ 3D Game Features

### Graphics & Rendering
- **Three.js WebGL renderer** with antialiasing
- **Real-time shadows** and lighting effects
- **3D snake segments** as individual cubes with proper materials
- **Glowing food spheres** with emissive materials
- **Textured 3D arena** with walls and ground plane
- **Grid overlay** for spatial reference

### Camera System
- **Orbital camera controls** with mouse interaction
- **Smooth camera movements** and zoom functionality
- **Adjustable viewing angles** for optimal gameplay
- **Perspective projection** for realistic 3D depth

### Lighting
- **Ambient lighting** for overall scene illumination
- **Directional lighting** casting realistic shadows
- **Dynamic point light** following the snake head
- **Emissive materials** for glowing effects

### Game Mechanics (Enhanced for 3D)
- Snake movement in 3D coordinate system (X, Z plane)
- 3D collision detection for walls and self-collision
- Dynamic snake segment creation and removal
- 3D food placement with collision avoidance
- Progressive speed increase with visual feedback

## 🛠️ Technical Details

### Built With
- **Three.js**: 3D graphics library for WebGL rendering
- **HTML5**: Semantic structure and modern web standards
- **CSS3**: Advanced styling with 3D-themed design
- **JavaScript ES6+**: Modern game logic and 3D scene management

### Browser Requirements
- **WebGL Support**: Required for 3D graphics rendering
- Chrome 60+ (Recommended)
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- **60 FPS** smooth 3D gameplay
- **Hardware acceleration** via WebGL
- **Optimized rendering** with efficient mesh management
- **Shadow mapping** for realistic lighting
- **Responsive canvas** sizing

## 📁 Project Structure

```
snake-game/
├── index.html      # 3D game HTML structure
├── style.css       # 3D-themed styling and animations
├── app.js          # 3D game logic with Three.js
└── README.md       # Project documentation
```

## 🚀 Getting Started

### Online Play
Simply visit: [https://trenbolone1122.github.io/snake-game/](https://trenbolone1122.github.io/snake-game/)

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/trenbolone1122/snake-game.git
   ```

2. Navigate to the project directory:
   ```bash
   cd snake-game
   ```

3. Serve with a local web server (required for Three.js):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server
   
   # Using Live Server (VS Code extension)
   # Right-click index.html -> "Open with Live Server"
   ```

4. Open your browser and visit `http://localhost:8000`

### WebGL Check
The game automatically checks for WebGL support and will alert if your browser doesn't support it.

## 🎨 3D Customization

The 3D game is highly customizable:

- **Colors**: Modify material colors in `app.js`
- **Lighting**: Adjust light intensity and positioning
- **Arena Size**: Change `BOARD_SIZE` for different playing field sizes
- **Snake Appearance**: Modify geometry and materials
- **Camera Behavior**: Adjust camera distance and angles
- **Speed**: Modify `GAME_SPEED` for different difficulty levels

## 🐛 Known Issues

- High score is stored per session (resets on browser close)
- Mobile touch controls not implemented (mouse/keyboard only)
- Requires WebGL-compatible browser

## 🔮 Future 3D Enhancements

- [ ] **Mobile touch controls** for camera and movement
- [ ] **VR support** for immersive gameplay
- [ ] **Particle effects** for food consumption
- [ ] **3D sound effects** with positional audio
- [ ] **Multiple camera modes** (first-person, top-down, etc.)
- [ ] **Environmental effects** (fog, skybox, weather)
- [ ] **3D power-ups** and special items
- [ ] **Multiplayer 3D mode**
- [ ] **Level editor** for custom 3D arenas
- [ ] **Replay system** with 3D camera paths

## 💻 System Requirements

### Minimum
- **GPU**: DirectX 9 compatible
- **RAM**: 2GB
- **Browser**: WebGL 1.0 support

### Recommended
- **GPU**: Dedicated graphics card
- **RAM**: 4GB+
- **Browser**: Latest version with WebGL 2.0

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/trenbolone1122/snake-game/issues).

### Areas for Contribution
- 3D graphics enhancements
- Performance optimizations
- Mobile/touch support
- VR/AR features
- Sound and music integration

## ⭐ Show Your Support

If you enjoyed this 3D game, please give it a ⭐ on GitHub!

---

**Experience Snake like never before in full 3D! 🐍🎮✨**