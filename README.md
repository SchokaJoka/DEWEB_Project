# Z-Axis Adventure Game

A browser-based adventure game that uses CSS 3D transformations and parallax effects to create an immersive Z-axis movement experience. The game features multiple scenes, interactive storytelling, and dynamic animations.

## Features

- 5 unique scenes with parallax layers
- Z-axis movement (forward/backward) with smooth transitions
- Left/right rotation for enhanced exploration
- Interactive storytelling with choice-based progression
- Dynamic animations including:
  - Parallax effect on mouse movement
  - Scene transitions with zoom effects
  - Special animations (door opening, eyes opening)
  - Character idle animations
- Background music and sound effects
- Score tracking system

## Technical Implementation

The game is built using vanilla JavaScript and CSS, without any external libraries or frameworks. Key technical features include:

- CSS 3D transforms for scene transitions and rotations
- CSS animations for visual effects
- Parallax effect using mouse movement
- Audio management system for background music and sound effects
- Score tracking with server integration

## Project Structure

```
.
├── index.html
├── styles/
│   └── main.css
├── js/
│   ├── game.js
│   ├── animations.js
│   └── audio.js
└── assets/
    ├── images/
    │   └── [scene images]
    └── audio/
        └── [audio files]
```

## Setup

1. Clone the repository
2. Set up a local web server (e.g., using Python's `http.server` or Node.js's `http-server`)
3. Place your scene images in the `assets/images` directory
4. Place your audio files in the `assets/audio` directory
5. Start the web server and open the game in your browser

## Required Assets

### Images
- forest-bg.jpg
- forest-trees.png
- forest-path.png
- deep-forest-bg.jpg
- deep-forest-trees.png
- house-distant.png
- house-bg.jpg
- house-exterior.png
- house-door.png
- interior-bg.jpg
- interior-furniture.png
- basement-door.png
- basement-bg.jpg
- basement-items.png
- treasure-chest.png

### Audio
- forest-ambience.mp3
- house-ambience.mp3
- house-interior.mp3
- basement-ambience.mp3
- door-creak.mp3
- footsteps.mp3
- chest-open.mp3

## Controls

- Forward/Backward buttons: Move between scenes
- Left/Right buttons: Rotate the current scene
- Choice buttons: Make decisions to progress through the story

## Server Integration

The game includes a score tracking system that requires a server endpoint at `/api/score`. The server should accept POST requests with a JSON payload containing the score:

```json
{
  "score": number
}
```

## Browser Compatibility

The game uses modern CSS features and requires a browser that supports:
- CSS 3D transforms
- CSS animations
- Web Audio API
- Fetch API

Recommended browsers: Latest versions of Chrome, Firefox, Safari, or Edge. 