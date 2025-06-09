class Game {
    constructor() {
        this.currentScene = 0;
        this.score = 0;
        this.scenes = [
            {
                id: 'forest-entrance',
                layers: [
                    { class: 'layer-bg', image: 'assets/forest-bg.jpg' },
                    { class: 'layer-mid', image: 'assets/forest-trees.png' },
                    { class: 'layer-front', image: 'assets/forest-path.png' }
                ],
                text: 'You find yourself at the entrance of a mysterious forest...',
                choices: [
                    { text: 'Move forward into the forest', nextScene: 1 }
                ]
            },
            {
                id: 'forest-path',
                layers: [
                    { class: 'layer-bg', image: 'assets/deep-forest-bg.jpg' },
                    { class: 'layer-mid', image: 'assets/deep-forest-trees.png' },
                    { class: 'layer-front', image: 'assets/house-distant.png' }
                ],
                text: 'Through the trees, you spot an old house in the distance...',
                choices: [
                    { text: 'Approach the house', nextScene: 2 },
                    { text: 'Go back', nextScene: 0 }
                ]
            },
            {
                id: 'house-exterior',
                layers: [
                    { class: 'layer-bg', image: 'assets/house-bg.jpg' },
                    { class: 'layer-mid', image: 'assets/house-exterior.png' },
                    { class: 'layer-front', image: 'assets/house-door.png' }
                ],
                text: 'The house looms before you. The door seems to be slightly ajar...',
                choices: [
                    { text: 'Enter the house', nextScene: 3 },
                    { text: 'Go back to the path', nextScene: 1 }
                ]
            },
            {
                id: 'house-interior',
                layers: [
                    { class: 'layer-bg', image: 'assets/interior-bg.jpg' },
                    { class: 'layer-mid', image: 'assets/interior-furniture.png' },
                    { class: 'layer-front', image: 'assets/basement-door.png' }
                ],
                text: 'The house is dark and dusty. You notice a door leading to the basement...',
                choices: [
                    { text: 'Go down to the basement', nextScene: 4 },
                    { text: 'Leave the house', nextScene: 2 }
                ]
            },
            {
                id: 'basement',
                layers: [
                    { class: 'layer-bg', image: 'assets/basement-bg.jpg' },
                    { class: 'layer-mid', image: 'assets/basement-items.png' },
                    { class: 'layer-front', image: 'assets/treasure-chest.png' }
                ],
                text: 'In the basement, you discover an ancient treasure chest!',
                choices: [
                    { text: 'Open the chest', action: 'openTreasure' },
                    { text: 'Go back upstairs', nextScene: 3 }
                ]
            }
        ];

        this.initializeGame();
    }

    initializeGame() {
        this.sceneContainer = document.getElementById('scene-container');
        this.textBox = document.getElementById('text-box');
        this.textContent = document.getElementById('text-content');
        this.choices = document.getElementById('choices');
        this.scoreDisplay = document.getElementById('score');

        // Navigation buttons
        document.getElementById('forward').addEventListener('click', () => this.moveForward());
        document.getElementById('backward').addEventListener('click', () => this.moveBackward());
        document.getElementById('left').addEventListener('click', () => this.turnLeft());
        document.getElementById('right').addEventListener('click', () => this.turnRight());

        this.loadScene(this.currentScene);
        this.updateScore(0);
    }

    loadScene(sceneIndex) {
        const scene = this.scenes[sceneIndex];
        this.sceneContainer.innerHTML = '';

        const sceneElement = document.createElement('div');
        sceneElement.className = 'scene';
        sceneElement.id = scene.id;

        // Create layers with parallax effect
        scene.layers.forEach(layer => {
            const layerElement = document.createElement('div');
            layerElement.className = `scene-layer ${layer.class}`;
            layerElement.style.backgroundImage = `url(${layer.image})`;
            sceneElement.appendChild(layerElement);
        });

        this.sceneContainer.appendChild(sceneElement);
        this.updateText(scene.text, scene.choices);
    }

    updateText(text, choices) {
        this.textContent.textContent = text;
        this.choices.innerHTML = '';
        
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                if (choice.action) {
                    this[choice.action]();
                } else if (choice.nextScene !== undefined) {
                    this.navigateToScene(choice.nextScene);
                }
            });
            this.choices.appendChild(button);
        });

        this.textBox.classList.remove('hidden');
    }

    navigateToScene(sceneIndex) {
        const currentSceneElement = document.querySelector('.scene');
        currentSceneElement.classList.add('zoom-in');

        setTimeout(() => {
            this.currentScene = sceneIndex;
            this.loadScene(sceneIndex);
        }, 1000);
    }

    moveForward() {
        const scene = this.scenes[this.currentScene];
        const forwardChoice = scene.choices.find(choice => choice.nextScene > this.currentScene);
        if (forwardChoice) {
            this.navigateToScene(forwardChoice.nextScene);
        }
    }

    moveBackward() {
        const scene = this.scenes[this.currentScene];
        const backwardChoice = scene.choices.find(choice => choice.nextScene < this.currentScene);
        if (backwardChoice) {
            this.navigateToScene(backwardChoice.nextScene);
        }
    }

    turnLeft() {
        const sceneElement = document.querySelector('.scene');
        sceneElement.style.transform = 'rotateY(-90deg)';
        setTimeout(() => {
            sceneElement.style.transform = '';
        }, 1000);
    }

    turnRight() {
        const sceneElement = document.querySelector('.scene');
        sceneElement.style.transform = 'rotateY(90deg)';
        setTimeout(() => {
            sceneElement.style.transform = '';
        }, 1000);
    }

    updateScore(points) {
        this.score += points;
        this.scoreDisplay.textContent = this.score;
        this.saveScore();
    }

    async saveScore() {
        try {
            const response = await fetch('/api/score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score: this.score })
            });
            const data = await response.json();
            console.log('Score saved:', data);
        } catch (error) {
            console.error('Error saving score:', error);
        }
    }

    openTreasure() {
        const treasureChest = document.querySelector('#basement .layer-front');
        treasureChest.classList.add('door-open');
        this.updateScore(100);
        this.updateText(
            'You found a magical artifact! Your score has increased.',
            [{ text: 'Go back upstairs', nextScene: 3 }]
        );
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    window.game = new Game();
}); 