const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');

// get finalscore from localSotrage and show to html
const mostRecentScore = localStorage.getItem('mostRecentScore');
let finalScoreText = document.getElementById('finalScore');
finalScoreText.innerText = mostRecentScore;

// get highScores from localStorage
const MAX_HIGH_SCORES = 5;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
})

// onClick saveHighScore 
saveHighScore = e => {
    // prevent form submit automatic event
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value
    };

    highScores.push(score);
    // sort by highest score
    highScores.sort( (a,b) => (b.score - a.score) );
    // only first 5 scores
    highScores.splice(5);

    // save to localStorage
    localStorage.setItem('highScores', JSON.stringify(highScores));
    // back home
    window.location.assign("/");
}