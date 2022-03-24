'use strict';

let startButton = $('#start-game');
let nameInput = $('.player-name-input');
let playerNameDom = $('.player-name');
let easyBtn = $('#easy-btn');     //12 cards
let mediumBtn = $('#medium-btn'); //16 cards
let hardBtn = $('#hard-btn');     //20 cards 
let difficulty = 8;
let gameisRunning = false;
let gameTimer = null;
let timer = $('.time');
let quitBtn = $('.play-again-btn');
let scoreBoard = $('.flip-score');
let score = 0;
let restartBtn = $('.restart-game');



$('#hard-mode-container').hide();
$('#easy-mode-container').hide();
$('#medium-mode-container').hide();
$('#game-over-container').hide();
$('#victory-container').hide();


startButton.on('click', startGame);
quitBtn.on('click', function () { console.log('hello'); quitGame(); });
easyBtn.on('click', function () { setDifficulty(12); });
mediumBtn.on('click', function () { setDifficulty(16); });
hardBtn.on('click', function () { setDifficulty(20); });

//RESTART
const restartGameboard = function (restartBtn) {
    gameCards.forEach(card => {
        card.classList.remove('flip')
    });
    resetScore();
    randomCard();
    resetTime();
}

restartBtn.on('click', restartGameboard);
//QUIT
const quitGame = function (quitBtn) {
    location.reload();
}


// GAME CODE

let gameCards = document.querySelectorAll('.card');
let flippedCard = false;
let holdBoard = false;
let firstClick, secondClick;

function flipCard() {
    if (holdBoard) return;
    if (this === firstClick) return;
    this.classList.add('flip'); //flip in css to turn it 180deg
    if (!flippedCard) {
        //first click card condition
        flippedCard = true;
        firstClick = this;
        return;
    }
    //second click card condition
    secondClick = this;
    //check if the cards match
    checkMatchCards();

}


function checkMatchCards() {
    let isMatch = firstClick.dataset.name === secondClick.dataset.name;
    //conidtion ? true : flase
    isMatch ? disableCards() : flipbackCards();

    if (isMatch) {
        if ($('.flip').length == gameCards.length) {
            $('#victory-container').show();
            $('#game-over-container').hide();
            $('#easy-mode-container').hide();
            stopTime();
        }
        score++;
        scoreBoard.html(score);

    }
}


function disableCards() {
    firstClick.removeEventListener('click', flipCard);
    secondClick.removeEventListener('click', flipCard);

    resetCard();
}


function flipbackCards() {
    holdBoard = true;
    //if card is not a match and add 1sec interval
    setTimeout(() => {
        firstClick.classList.remove('flip');
        secondClick.classList.remove('flip');
        resetCard();
    }, 1000);
}


function resetCard() {
    [flippedCard, holdBoard] = [false, false];
    [firstClick, secondClick] = [null, null];
}

// to immidiate shuffle the cards before the player starts game
function randomCard() {
    gameCards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
};
randomCard();
gameCards.forEach(card => card.addEventListener('click', flipCard));

//END OF GAME CODE


function startGame() {
    console.log(nameInput.val());
    if (nameInput.val()) {
        playerNameDom.html(nameInput.val());
    }
    if (difficulty === 16) {
        switchScreen('#medium-mode-container');
    } else if (difficulty === 20) {
        switchScreen('#hard-mode-container');
    } else {
        switchScreen('#easy-mode-container');
    }
    startTimer(60, timer);
};


function switchScreen(screenId) {
    $('.screen').hide();
    $(screenId).show();
}



// TIMER
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    gameTimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        $(display).text(minutes + ":" + seconds);

        if (--timer < 0) {
            timer = duration;
            $('#game-over-container').show();
            $('#victory-container').hide();
            $('#easy-mode-container').hide();
            $('#medium-mode-container').hide();
            $('#hard-mode-container').hide();
            stopTime();
        }
    }, 1000);
}

function stopTime() {
    clearInterval(gameTimer);
}

function resetTime() {
    stopTime();
    startTimer(60, timer);

}

//RESET SCORE
function resetScore() {
    score = 0;
    scoreBoard.html(score);
}

//DIFFICULTY
function setDifficulty(numberOfCards) {
    difficulty = numberOfCards;
    console.log('Difficulty selected = ' + difficulty);
    gameCards = document.querySelectorAll('.card');
    if (difficulty === 16) {
        gameCards = document.querySelectorAll('#medium-mode-gameboard .card');
    } else if (difficulty === 20) {
        gameCards = document.querySelectorAll('#hard-mode-gameboard .card');
    }
    else {
        gameCards = document.querySelectorAll('#easy-mode-gameboard .card');
    }
}




//Moving background

// DOM selectors
const stars = document.getElementById('stars');
const starsCtx = stars.getContext('2d');
const slider = document.querySelector(".slider input");
const output = document.querySelector("#speed");

// global variables
let screen, starsElements, starsParams = { speed: 2, number: 300, extinction: 4 };

// run stars
setupStars();
updateStars();

// handle slider
output.innerHTML = slider.value;
slider.oninput = function () {
    output.innerHTML = this.value;
    starsParams.speed = this.value;
};

// update stars on resize to keep them centered
window.onresize = function () {
    setupStars();
};

// star constructor
function Star() {
    this.x = Math.random() * stars.width;
    this.y = Math.random() * stars.height;
    this.z = Math.random() * stars.width;

    this.move = function () {
        this.z -= starsParams.speed;
        if (this.z <= 0) {
            this.z = stars.width;
        }
    };

    this.show = function () {
        let x, y, rad, opacity;
        x = (this.x - screen.c[0]) * (stars.width / this.z);
        x = x + screen.c[0];
        y = (this.y - screen.c[1]) * (stars.width / this.z);
        y = y + screen.c[1];
        rad = stars.width / this.z;
        opacity = (rad > starsParams.extinction) ? 1.5 * (2 - rad / starsParams.extinction) : 1;

        starsCtx.beginPath();
        starsCtx.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
        starsCtx.arc(x, y, rad, 0, Math.PI * 2);
        starsCtx.fill();
    }
}

// setup <canvas>, create all the starts
function setupStars() {
    screen = {
        w: window.innerWidth,
        h: window.innerHeight,
        c: [window.innerWidth * 0.5, window.innerHeight * 0.5]
    };
    window.cancelAnimationFrame(updateStars);
    stars.width = screen.w;
    stars.height = screen.h;
    starsElements = [];
    for (let i = 0; i < starsParams.number; i++) {
        starsElements[i] = new Star();
    }
}

// redraw the frame
function updateStars() {
    starsCtx.fillStyle = "black";
    starsCtx.fillRect(0, 0, stars.width, stars.height);
    starsElements.forEach(function (s) {
        s.show();
        s.move();
    });
    window.requestAnimationFrame(updateStars);
}