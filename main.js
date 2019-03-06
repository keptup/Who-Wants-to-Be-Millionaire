// Variable declarations
const URL = 'https://raw.githubusercontent.com/aaronnech/Who-Wants-to-Be-a-Millionaire/master/questions.json';
const gameContainer = document.querySelector('.game-container');
const startBtn = document.querySelector('.start');
const questionContainer = document.querySelector('.question-container');
const answersContainer = document.querySelector('.answers');
const nextQuestionBtn = document.querySelector('.next-question');
const secondGuessBtn = document.querySelector('.second-guess-button');
const fiftyFiftyBtn = document.querySelector('.fifty-fifty');
const countDownClock = document.querySelector('.timer');
// selecting audio files
const letsPlayAudio = document.getElementById('lets-play');
const easyAudio = document.getElementById('easy');
const gameStatusContainer = document.querySelector('.game-status-container');
const pointsContainer= document.querySelector('.points-container');

// let gameState = false;
let gameOn = false;
let timesToGuess = 1;
let correctAnswer;
let questionList;
let listOfAnswers;
let currentTime;
// Variables for the randomQuestionGenerator();
let data;
let currentQuestion = {};
let randomGameNum = 0;
let randomQuestionNum = 0;
let questionsAsked = [];
let timeoutId;
let intervalId;
let points = 0;

// Functions
const dataLoad = async () => {
  data = await fetch(URL).then(res => res.json());
};
const randomQuestionGenerator = () => {
  randomGameNum = Math.floor(Math.random() * 4);
  randomQuestionNum = Math.floor(Math.random() * 15);

  if (questionsAsked.findIndex(item => item[randomGameNum] === randomQuestionNum) === -1) {
    currentQuestion[randomGameNum] = randomQuestionNum;
    questionsAsked.push(currentQuestion);
    currentQuestion = {};
  } else {
    randomQuestionGenerator();
  };
}
const fiftyFiftyGenerator = (num) => {
	let randomFirst;
	let randomSecond;
	// Generate first random number
	randomFirst = Math.floor(Math.random() * 4);
	while (randomFirst === num) {
		randomFirst = Math.floor(Math.random() * 4);
	}

	randomSecond = Math.floor(Math.random() * 4);
	while (randomSecond === randomFirst || randomSecond === num) {
		randomSecond = Math.floor(Math.random() * 4);
	}
	// hide two wrong answers
	document.querySelector(`[data-id='${randomFirst}']`).style.visibility = 'hidden';
	document.querySelector(`[data-id='${randomSecond}']`).style.visibility = 'hidden';
};
const startTimerMusic = () => {
  setTimeout(() => {
    timer();
  }, 4000);
  // start audio
  letsPlayAudio.play();
  timeoutId = setTimeout(() => {
    easyAudio.play();
  }, 4000);
};
const stopTimerMusic = () => {
  clearTimeout(timeoutId);
  clearInterval(intervalId);
  letsPlayAudio.pause();
  letsPlayAudio.currentTime = 0;
  easyAudio.pause();
  easyAudio.currentTime = 0;
}
const resetPoints = () => {
  points = 0;
  pointsContainer.textContent = points;
}
const gameOver = () => {
  gameOn = false;
  // stoping audio
  stopTimerMusic();
  gameContainer.classList.add('hidden');
  gameStatusContainer.classList.remove('hidden');
  gameStatusContainer.textContent = `GAME OVER.\nYou earner ${points}`;
  startBtn.textContent = 'START';
};
const nextQuestionFunc = () => {
  nextQuestionBtn.classList.add('hidden');
  stopTimerMusic();
  gameOn = true;
  gameContainer.classList.remove('hidden');
  gameStatusContainer.classList.add('hidden');
  startBtn.textContent = 'QUIT';

  let answers = '';
  randomQuestionGenerator();
  startTimerMusic();

  correctAnswer = '';
  correctAnswer = data['games'][randomGameNum]['questions'][randomQuestionNum]['correct'];
  questionList = data['games'][randomGameNum]['questions'][randomQuestionNum]['content'];

  questionList.forEach((item, index) => {
    answers += `<li id="${index}">${item}</li>`;
  });

  questionContainer.textContent = data['games'][randomGameNum]['questions'][randomQuestionNum]['question'];
  answersContainer.innerHTML = answers;
};
const timer = () => {
  currentTime = new Date().getTime();
  intervalId = setInterval(() => {
    let interval = Math.floor(((40000 + currentTime) - new Date().getTime()) / 1000);
    countDownClock.textContent = interval;
    if (interval === 0) {
      gameState = false;
      clearInterval(intervalId);
      gameOver();
    }

    return interval;
  }, 100);
};

// Event Listeners
window.addEventListener('load', async () => {
  await dataLoad();
});
startBtn.addEventListener('click', () => {
  if (!gameOn) {
    resetPoints();
    nextQuestionFunc();
  } else {
    gameOver();
  }
});
nextQuestionBtn.addEventListener('click', () => {
  if (timesToGuess > 0) {
    nextQuestionFunc();
  } else {
    gameOver();
  }
});
secondGuessBtn.addEventListener('click', () => {
	// change let timesToGuess to 2
	timesToGuess = 2;
	// hide the x2 button
	secondGuessBtn.style.visibility = 'hidden';

});
fiftyFiftyBtn.addEventListener('click', () => {
	// Remove two wrong answers
	fiftyFiftyGenerator(correctAnswer);
	// hide the 50:50 button
	fiftyFiftyBtn.style.visibility = 'hidden';
});
answersContainer.addEventListener('click', (e) => {
  if (e.target.id == correctAnswer) {
    e.target.classList.add('hidden');
    gameStatusContainer.textContent = 'CORRECT';
    points += 1;
    pointsContainer.textContent = points;
    console.log('Correct');
  } else {
    e.target.classList.add('hidden');
    timesToGuess -= 1;
    if (!timesToGuess) {
      gameOver();
    }
  }
});
