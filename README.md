# 🐍 Snake Game

A classic Snake game built with vanilla HTML5, CSS3, and JavaScript. Play the timeless arcade game right in your browser!

## 🎮 Play Now

**[Play the Game](https://trenbolone1122.github.io/snake-game/)**

## ✨ Features

- **Classic Gameplay**: Traditional snake mechanics with modern polish
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Controls**: Arrow keys or WASD for movement
- **Score Tracking**: Keep track of your current and high scores
- **Pause Functionality**: Pause/unpause with spacebar
- **Game States**: Start screen, gameplay, pause, and game over screens
- **Visual Effects**: Modern styling with gradients and animations
- **Progressive Speed**: Game gets faster as you score higher

## 🎯 How to Play

1. **Start**: Click "Start Game" or press any key from the title screen
2. **Move**: Use arrow keys or WASD to control the snake
3. **Eat**: Guide the snake to eat the red food blocks
4. **Grow**: Each food eaten makes the snake longer and increases your score
5. **Avoid**: Don't hit the walls or the snake's own body
6. **Win**: Try to beat your high score!

## 🎮 Controls

| Key | Action |
|-----|--------|
| ↑ or W | Move Up |
| ↓ or S | Move Down |
| ← or A | Move Left |
| → or D | Move Right |
| Space | Pause/Unpause |
| R | Restart Game |
| Enter | Start Game / Play Again |
| Escape | Return to Main Menu |

## 🏗️ Game Features

### Core Mechanics
- Snake grows by one segment for each food consumed
- Score increases by 10 points per food item
- Game speed increases progressively with score
- Collision detection for walls and self-collision

### Visual Design
- Modern dark theme with blue gradient background
- Glowing green snake with distinct head and body colors
- Red food with rounded corners
- Smooth animations and transitions
- Responsive layout for different screen sizes

### Game States
1. **Title Screen**: Game introduction and instructions
2. **Playing**: Active gameplay with score display
3. **Paused**: Game paused with indicator
4. **Game Over**: Final score display with restart options

## 🛠️ Technical Details

### Built With
- **HTML5**: Semantic structure and canvas element
- **CSS3**: Modern styling with flexbox and animations
- **JavaScript ES6+**: Game logic and canvas rendering

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- 60 FPS smooth gameplay
- Optimized canvas rendering
- Efficient collision detection
- Session-based high score storage

## 📁 Project Structure

```
snake-game/
├── index.html      # Main HTML structure
├── style.css       # Game styling and animations
├── app.js          # Game logic and mechanics
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

3. Open `index.html` in your browser or serve it with a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server
   ```

4. Open your browser and visit `http://localhost:8000`

## 🎨 Customization

The game is easily customizable:

- **Colors**: Modify CSS variables in `style.css`
- **Speed**: Adjust `GAME_SPEED` in `app.js`
- **Grid Size**: Change `GRID_SIZE` in `app.js`
- **Scoring**: Modify score increment in the `update()` method

## 🐛 Known Issues

- High score is stored per session (resets on browser close)
- Mobile touch controls not implemented (keyboard only)

## 🔮 Future Enhancements

- [ ] Touch/swipe controls for mobile devices
- [ ] Multiple difficulty levels
- [ ] Power-ups and special food items
- [ ] Persistent high score storage
- [ ] Sound effects and background music
- [ ] Leaderboard functionality
- [ ] Different game modes (walls/no walls, etc.)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/trenbolone1122/snake-game/issues).

## ⭐ Show Your Support

If you enjoyed this game, please give it a ⭐ on GitHub!

---

**Enjoy the game! 🐍🎮**