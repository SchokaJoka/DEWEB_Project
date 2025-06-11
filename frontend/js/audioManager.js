class AudioManager {
    constructor() {
        this.audioElements = {
            0: document.getElementById('audio-80s'),
            1: document.getElementById('audio-90s'),
            2: document.getElementById('audio-2000s'),
            3: document.getElementById('audio-2010s')
        };
        this.isMuted = false;
        this.isInitialized = false;
        this.fadeAnimations = new Map(); // Track ongoing fade animations

        // Create and add mute button
        this.createMuteButton();
        
        // Add click handler to initialize audio
        document.addEventListener('click', () => {
            if (!this.isInitialized) {
                this.initializeAudio();
            }
        }, { once: true });
    }

    createMuteButton() {
        this.muteButton = document.getElementById('mute-button');
        this.muteButton.addEventListener('click', () => this.toggleMute());
    }

    initializeAudio() {
        // First set all volumes to 0
        Object.values(this.audioElements).forEach(audio => {
            audio.volume = 0;
            audio.play().catch(e => {
                console.log('Audio play prevented. Waiting for user interaction.');
            });
        });
        
        this.isInitialized = true;
        
        // After initialization, immediately update volumes based on current visibility
        requestAnimationFrame(() => {
            this.updateVolumes(document.querySelectorAll('.decade-section'));
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.muteButton.textContent = this.isMuted ? '🔇' : '🔊';
        
        if (this.isMuted) {
            // Cancel all ongoing fade animations
            this.fadeAnimations.forEach((animationId) => {
                cancelAnimationFrame(animationId);
            });
            this.fadeAnimations.clear();
            
            // Immediately mute all audio
            Object.values(this.audioElements).forEach(audio => {
                audio.volume = 0;
            });
        } else {
            // When unmuting, update volumes based on current visibility
            this.updateVolumes(document.querySelectorAll('.decade-section'));
        }
    }

    fadeIn(audio, duration = 500) {
        if (!audio || this.isMuted) return;

        // Cancel any existing fade animation for this audio
        const existingAnimation = this.fadeAnimations.get(audio);
        if (existingAnimation) {
            cancelAnimationFrame(existingAnimation);
        }

        const startVolume = audio.volume;
        const startTime = performance.now();

        const animate = () => {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easeInOutQuad for smoother transition
            const easeProgress = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            audio.volume = startVolume + ((1 - startVolume) * easeProgress);

            if (progress < 1) {
                const animationId = requestAnimationFrame(animate);
                this.fadeAnimations.set(audio, animationId);
            } else {
                this.fadeAnimations.delete(audio);
            }
        };

        const animationId = requestAnimationFrame(animate);
        this.fadeAnimations.set(audio, animationId);
    }

    fadeOut(audio, duration = 500) {
        if (!audio) return;

        // Cancel any existing fade animation for this audio
        const existingAnimation = this.fadeAnimations.get(audio);
        if (existingAnimation) {
            cancelAnimationFrame(existingAnimation);
        }

        const startVolume = audio.volume;
        const startTime = performance.now();

        const animate = () => {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easeInOutQuad for smoother transition
            const easeProgress = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            audio.volume = startVolume * (1 - easeProgress);

            if (progress < 1) {
                const animationId = requestAnimationFrame(animate);
                this.fadeAnimations.set(audio, animationId);
            } else {
                this.fadeAnimations.delete(audio);
            }
        };

        const animationId = requestAnimationFrame(animate);
        this.fadeAnimations.set(audio, animationId);
    }

    updateVolumes(sections) {
        if (!this.isInitialized || this.isMuted) return;

        sections.forEach((section, index) => {
            const audio = this.audioElements[index];
            if (!audio) return;

            if (section.classList.contains('in-view')) {
                this.fadeIn(audio);
            } else {
                this.fadeOut(audio);
            }
        });
    }
}

// Export the AudioManager
window.AudioManager = AudioManager;