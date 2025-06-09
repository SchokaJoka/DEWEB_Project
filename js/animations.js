class Animations {
    static addWiggle(element) {
        element.classList.add('wiggle');
    }

    static removeWiggle(element) {
        element.classList.remove('wiggle');
    }

    static addParallaxEffect(container) {
        let lastX = 0;
        let lastY = 0;

        container.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

            const layers = container.querySelectorAll('.scene-layer');
            layers.forEach((layer, index) => {
                const depth = index + 1;
                const translateX = (moveX * depth) - lastX;
                const translateY = (moveY * depth) - lastY;

                layer.style.transform = `
                    ${layer.style.transform || ''}
                    translate(${translateX}px, ${translateY}px)
                `;
            });

            lastX = moveX;
            lastY = moveY;
        });
    }

    static async typeText(element, text, speed = 50) {
        element.textContent = '';
        for (let char of text) {
            element.textContent += char;
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }

    static shake(element, intensity = 5, duration = 500) {
        const originalPosition = element.style.transform || '';
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            if (elapsed < duration) {
                const x = Math.random() * intensity - intensity / 2;
                const y = Math.random() * intensity - intensity / 2;
                element.style.transform = `${originalPosition} translate(${x}px, ${y}px)`;
                requestAnimationFrame(update);
            } else {
                element.style.transform = originalPosition;
            }
        }

        requestAnimationFrame(update);
    }

    static fadeIn(element, duration = 1000) {
        element.style.opacity = '0';
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    static fadeOut(element, duration = 1000) {
        element.style.opacity = '1';
        element.style.transition = `opacity ${duration}ms`;
        
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }
}

// Add parallax effect to the scene container when the page loads
window.addEventListener('load', () => {
    const sceneContainer = document.getElementById('scene-container');
    Animations.addParallaxEffect(sceneContainer);
}); 