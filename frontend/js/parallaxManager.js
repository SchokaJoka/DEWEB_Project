const imgPath = "frontend/assets/decades";

fullWidth = window.innerWidth;
fullHeight = window.innerHeight;

class ParallaxManager {
    constructor() {
        this.scenes = [];
        this.init();
    }

    init() {
        // Create scenes for each decade
        for (let i = 0; i < 4; i++) {
            const scene = new Scene(i, [
                [`layer${i}-0`, 50, 20, true],          // layer 0 (z-index, movement amount)
                [`layer${i}-1`, 100, 100, true],         // layer 1
                [`layer${i}-2`, 150, 130, true],        // layer 2
                [`layer${i}-3`, 200, 160, true],        // layer 3
            ]);
            this.scenes.push(scene);
        }
    }
}

class Scene {
    constructor(decadeIndex, layerConfigs) {
        this.decadeIndex = decadeIndex;
        this.container = document.getElementById(`parallax-${decadeIndex}`);
        this.layers = layerConfigs.map(([id, zIndex, movementAmount, hasParallax]) => 
            new Layer(id, this.container, zIndex, movementAmount, hasParallax)
        );

        // Add mouse move listener for parallax effect
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleMouseMove(event) {
        const xOffset = event.clientX / window.innerWidth -0.5;
        const yOffset = event.clientY / window.innerHeight -0.5;

        this.layers.forEach(layer => layer.updatePosition(xOffset, yOffset));
    }
}

class Layer {
    constructor(id, container, zIndex, movementAmount, hasParallax) {
        this.element = document.createElement('div');
        this.element.className = 'layer';
        this.element.style.zIndex = zIndex;
        this.movementAmount = movementAmount;
        this.hasParallax = hasParallax;

        // Set background image
        this.element.style.backgroundImage = `url('frontend/assets/decades/${id}.png')`;
        
        // Add to container
        container.appendChild(this.element);

        // Initialize position
        this.currentX = 0;
        this.currentY = 0;
        this.targetX = 0;
        this.targetY = 0;
    }

    updatePosition(xOffset, yOffset) {
        if (!this.hasParallax) return;

        // Calculate new target position using movementAmount
        this.targetX = xOffset * this.movementAmount;
        this.targetY = yOffset * this.movementAmount;

        // Smoothly animate to new position
        this.animate();
    }

    animate() {
        // Calculate new current position with easing
        this.currentX += (this.targetX - this.currentX) * 0.1;
        this.currentY += (this.targetY - this.currentY) * 0.1;

        // Apply transform
        this.element.style.transform = `
            translate(-50%, -50%)
            translate3d(${this.currentX}px, ${this.currentY}px, 0)
        `;

        // Continue animation if movement is still significant
        if (Math.abs(this.targetX - this.currentX) > 0.1 || 
            Math.abs(this.targetY - this.currentY) > 0.1) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// Initialize ParallaxManager when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParallaxManager();
});
