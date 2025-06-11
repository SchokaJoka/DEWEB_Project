// Function to update the vote display
function updateVoteDisplay(votes) {
    const voteResults = document.createElement('div');
    voteResults.className = 'vote-results';
    
    // Convert votes object to array and sort by vote count
    const sortedVotes = Object.entries(votes)
        .sort(([,a], [,b]) => b - a);
    
    voteResults.innerHTML = `
        <h2>Current Votes:</h2>
        <div class="vote-stats">
            ${sortedVotes.map(([decade, count], index) => {
                let className = '';
                if (index === 0) className = 'most-votes';
                else if (index === 1) className = 'second-votes';
                else if (index === 2) className = 'third-votes';
                else className = 'least-votes';
                
                return `<p class="${className}">${decade}: ${count} votes</p>`;
            }).join('')}
        </div>
    `;
    
    // Remove existing results if any
    const existingResults = document.querySelector('.vote-results');
    if (existingResults) {
        existingResults.remove();
    }
    
    // Add new results after the button container
    const buttonContainer = document.querySelector('.button-container');
    buttonContainer.parentNode.insertBefore(voteResults, buttonContainer.nextSibling);
    
    // Add visible class after a small delay to trigger animation
    setTimeout(() => {
        voteResults.classList.add('visible');
    }, 50);
}

// Function to handle vote submission
async function submitVote(decade) {
    try {
        // Remove selected class from all buttons
        document.querySelectorAll('.button-container button').forEach(button => {
            button.classList.remove('selected');
        });
        
        // Add selected class to clicked button
        const buttons = document.querySelectorAll('.button-container button');
        const selectedButton = Array.from(buttons).find(button => button.textContent === decade);
        if (selectedButton) {
            selectedButton.classList.add('selected');
        }
        
        const response = await fetch('http://localhost:3000/api/votes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ decade }),
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const updatedVotes = await response.json();
        updateVoteDisplay(updatedVotes);
    } catch (error) {
        console.error('Error submitting vote:', error);
    }
}

// Function to fetch current votes
async function fetchVotes() {
    try {
        const response = await fetch('http://localhost:3000/api/votes');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const votes = await response.json();
        // Only show results if there are votes
        if (Object.values(votes).some(count => count > 0)) {
            updateVoteDisplay(votes);
        }
    } catch (error) {
        console.error('Error fetching votes:', error);
    }
}

// Add click event listeners to all vote buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const decade = button.textContent;
            submitVote(decade);
        });
    });
    
    // Fetch initial votes
    fetchVotes();
}); 