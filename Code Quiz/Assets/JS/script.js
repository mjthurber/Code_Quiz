const questions = [
    {
        question: 'Commonly used data types do NOT include ',
        choices: ['strings', 'boolean', 'alerts','numbers'],
        correctAnswer: 'alerts'
    },
    {
        question: 'The common if/else statement is enclosed in',
        choices: ['quotes', 'curly brackets', 'parenthesis'],
        correctAnswer: 'parenthesis'
    },
    {
        question: 'Arrays in Javascript are used to store',
        choices: ['numbers and strings', 'other arrays', 'quotes', 'all of the above'],
        correctAnswer: 'all of the above'
    }
];

const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const results = document.getElementById('results');
const startButton = document.getElementById('startButton');
const scoreContainer = document.getElementById('scoreContainer');
const scoreList = document.getElementById('scoreList');
const submitScoreButton = document.getElementById('submitScoreButton');
const scoreListForm = document.getElementById('scoreListForm');

let currentQuestionIndex = 0;
let numCorrect = 0;
let numIncorrect = 0;
let timerInterval;

function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;

        choicesElement.innerHTML = '';
        currentQuestion.choices.forEach((choice, index) => {
            const li = document.createElement('li');
            li.textContent = choice;
            li.addEventListener('click', () => checkAnswer(choice));
            choicesElement.appendChild(li);
        });
    } else {
        finishQuiz();
    }
}

function checkAnswer(selectedChoice) {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedChoice === currentQuestion.correctAnswer) {
        numCorrect++;
    } else {
        numIncorrect++;
    }

    currentQuestionIndex++;
    displayQuestion();
}

function startQuiz() {
    currentQuestionIndex = 0;
    numCorrect = 0;
    numIncorrect = 0;
    startButton.disabled = true;
    startTimer();
    displayQuestion();
}

function startTimer() {
    let seconds = 30; 
    const timerDisplay = document.getElementById('timerDisplay'); 

    timerInterval = setInterval(function () {
        seconds--;
        timerDisplay.textContent = seconds + ' seconds';

        if (seconds === 0) {
            clearInterval(timerInterval);
            finishQuiz();
        }
    }, 1000);
}

function finishQuiz() {
    clearInterval(timerInterval);
    results.textContent = 'Quiz completed! Your score is ' + numCorrect + ' correct and ' + numIncorrect + ' incorrect.';
    scoreListForm.style.display = 'block';
    submitScoreButton.removeAttribute("hidden");
    submitScoreButton.addEventListener('click', submitScore);
}

function submitScore() {
    const initials = prompt('Enter your initials');
    if (initials !== null && initials !== '') {
        const scoreData = {
            initials: initials,
            correct: numCorrect,
            incorrect: numIncorrect
        };

        // Get the stored score list or initialize it as an empty array
        const storedScoreList = JSON.parse(localStorage.getItem('scoreList')) || [];

        // Add the new score data to the list
        storedScoreList.push(scoreData);

        // Store the updated score list in localStorage
        localStorage.setItem('scoreList', JSON.stringify(storedScoreList));

        // Display the score list
        renderScoreList(storedScoreList);
    } else {
        alert('Please enter your initials.');
    }
}

function renderScoreList(scoreListData) {
    // Clear existing score list
    scoreList.innerHTML = '';

    // Render a new list item for each score entry
    scoreListData.forEach((scoreData, index) => {
        const li = document.createElement('li');
        li.textContent = scoreData.initials + ' - ' + scoreData.correct + ' correct, ' + scoreData.incorrect + ' incorrect';
        scoreList.appendChild(li);
    });
}

function init() {
    // Render the initial score list with an empty array
    renderScoreList([]);
}

// Initialize the application
init();

// Event listener for starting the quiz
startButton.addEventListener('click', startQuiz);

// Event listener for submitting the score (moved outside finishQuiz)
submitScoreButton.addEventListener('click', submitScore);