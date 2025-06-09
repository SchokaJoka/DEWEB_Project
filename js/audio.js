class AudioManager {
    constructor() {
        this.backgroundMusic = document.getElementById('background-music');
        this.soundEffects = new Map();
        this.isMuted = false;

        this.initializeSounds();
    }

    initializeSounds() {
        // Background music for different scenes
        this.backgroundTracks = {
            'forest-entrance': 'assets/audio/forest-ambience.mp3',
            'forest-path': 'assets/audio/forest-ambience.mp3',
            'house-exterior': 'assets/audio/house-ambience.mp3',
            'house-interior': 'assets/audio/house-interior.mp3',
            'basement': 'assets/audio/basement-ambience.mp3'
        };

        // Sound effects
        this.loadSoundEffect('door-creak', 'assets/audio/door-creak.mp3');
        this.loadSoundEffect('footsteps', 'assets/audio/footsteps.mp3');
        this.loadSoundEffect('chest-open', 'assets/audio/chest-open.mp3');
    }

    loadSoundEffect(name, src) {
        const audio = new Audio(src);
        this.soundEffects.set(name, audio);
    }

    playBackgroundMusic(sceneId) {
        const track = this.backgroundTracks[sceneId];
        if (track && !this.isMuted) {
            this.backgroundMusic.src = track;
            this.backgroundMusic.play().catch(error => {
                console.warn('Auto-play prevented:', error);
            });
        }
    }

    playSoundEffect(name) {
        if (this.isMuted) return;

        const sound = this.soundEffects.get(name);
        if (sound) {
            // Clone the audio to allow multiple plays
            const clone = sound.cloneNode();
            clone.play().catch(error => {
                console.warn('Sound effect play prevented:', error);
            });
        }
    }

    fadeOutBackground(duration = 1000) {
        if (!this.backgroundMusic.paused) {
            const steps = 20;
            const stepTime = duration / steps;
            const volumeStep = this.backgroundMusic.volume / steps;

            const fadeInterval = setInterval(() => {
                if (this.backgroundMusic.volume > volumeStep) {
                    this.backgroundMusic.volume -= volumeStep;
                } else {
                    this.backgroundMusic.pause();
                    this.backgroundMusic.volume = 1.0;
                    clearInterval(fadeInterval);
                }
            }, stepTime);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.backgroundMusic.muted = this.isMuted;
        return this.isMuted;
    }

    setVolume(level) {
        const volume = Math.max(0, Math.min(1, level));
        this.backgroundMusic.volume = volume;
        this.soundEffects.forEach(sound => {
            sound.volume = volume;
        });
    }
}

// Initialize audio manager when the page loads
window.addEventListener('load', () => {
    window.audioManager = new AudioManager();
}); 