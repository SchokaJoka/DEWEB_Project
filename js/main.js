let sections;
let audioManager;
let scrollTimeout;

// Start everything when the page is fully loaded
window.addEventListener('load', () => { 
    init();
});

function init() {
    console.log('Hip-Hop Timeline starting up!');
    sections = document.querySelectorAll('.decade-section');
    audioManager = new AudioManager();

    // Trigger initial scroll check to ensure proper state
    handleScroll();

    // Set up scroll handling
    window.addEventListener('scroll', () => {
        // Use requestAnimationFrame to limit updates
        if (!scrollTimeout) {
            scrollTimeout = requestAnimationFrame(() => {
                handleScroll();
                scrollTimeout = null;
            });
        }
    });
}

// Function to update section visibility
function handleScroll() {
    let needsVolumeUpdate = false;
    
    sections.forEach((section, index) => {
        const wasVisible = section.classList.contains('in-view');
        const isVisible = isSectionVisible(section);
        
        if (isVisible) {
            if (!wasVisible) {
                section.classList.add('in-view');
                needsVolumeUpdate = true;
            }
        } else if (wasVisible) {
            section.classList.remove('in-view');
            needsVolumeUpdate = true;
        }
    });


    // Only update volumes if visibility changed
    if (needsVolumeUpdate) {
        audioManager.updateVolumes(sections);
    }
}

function isSectionVisible(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const middleStart = windowHeight * 0.05; // Start showing earlier (10% from top)
    const middleEnd = windowHeight * 0.95;   // End later (90% from top)
    const elementMiddle = rect.top + (rect.height / 2);
    
    return elementMiddle >= middleStart && elementMiddle <= middleEnd;
}

