const question = document.getElementById('question');
// get array of html
const choices = Array.from(document.getElementsByClassName('choice-text'));

const progressTextText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');

const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false; //enable to accept answers by click event
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = []; 

// fetch questions from external json file
// fetch("/data/questions.json")
//     .then( res => {
//         return res.json();
//     }).then( loadedQuestions => {
//         questions = loadedQuestions;
//         startGame();
//     })
//     .catch( err => {
//         console.error(err);
//     })

// fetch api from remote api
fetch("https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple")
    .then(res => {
        return res.json();
    }).then(loadedQuestions => {
        // get formatted questions
        questions = loadedQuestions.results.map( loadedQuestion => {
            
            let formattedQuestion = {
                question: loadedQuestion.question
            }
            // get incorrect_answers
            let answerChoices = [...loadedQuestion.incorrect_answers]
            // set what is the correct answer index
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            // insert correct answer to the right index
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);
            // get formatted answers
            answerChoices.forEach( (choice, index) => {
                formattedQuestion[`choice${index+1}`] = choice;
            });

            return formattedQuestion;
        })
        startGame();
    })
    .catch(err => {
        console.error(err);
    })    

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
    questionCounter = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    loader.classList.add('hidden');
    game.classList.remove('hidden');    
}

getNewQuestion = () => {

    // check if the questions are completed
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        // goto the end page
        return window.location.assign('/pages/end.html');
    }
    
    questionCounter++;
    progressTextText.innerText = `Question: ${questionCounter}/${MAX_QUESTIONS}`;
    // update progressBar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion[`choice${number}`];
    } );

    // remove the question used
    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};

// add event for each choice clicked
choices.forEach( choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = (selectedAnswer == currentQuestion.answer) ? 'correct' : 'incorrect' ;
        selectedChoice.parentElement.classList.add(classToApply);

        if(classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            // load a new question after choice
            getNewQuestion();
        }, 1000 )

    })
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};