let highScoresList = document.getElementById('highScoresList');
const highScores = JSON.parse(localStorage.getItem('highScores'));

// set high scores list from highScoreList array
highScoresList.innerHTML = highScores.map( score => {
    return `<li class='high-score'>${score.name} - ${score.score}</li>`
}).join("");