let ratings = [];
let idCounter = 0;

// In-memory storage for votes (replace with actual database in production)
let votes = {
  '1980s': 0,
  '1990s': 0,
  '2000s': 0,
  '2010s': 0
};

export function readRatings() {
    return ratings;
}

export function updateRating(id, newRating) {

}

export function createRating(newRating) {

    newRating.id = idCounter;
    idCounter++;

    newRating.createdAt = new Date().toISOString();
    newRating.updatedAt = new Date().toISOString();

    ratings.push(newRating);

    console.log(`Added rating: ${newRating}`);
}

export function deleteRating(id) {
    ratings = ratings.filter((rating) => rating.id !== id);

    console.log(`Rating with id: ${id} removed`);;
}

export function readVotes() {
  return votes;
}

export function createVote(rating) {
  const decade = rating.decade;
  if (votes.hasOwnProperty(decade)) {
    votes[decade]++;
  }
  return votes;
}

createRating({
    potionId: 1,
    value: 5
});