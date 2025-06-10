const imgPath = "assets/";

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
                [`layer${i}-back`, 50, 20, true],    // Background layer (z-index, movement amount)
                [`layer${i}-mid`, 100, 80, true],    // Middle layer
                [`layer${i}-front`, 150, 120, true],  // Front layer
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
        this.element.style.backgroundImage = `url('assets/decades/${id}.png')`;
        
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
