'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreEl = document.querySelector('.game-score');
const cellsEl = document.querySelectorAll('.field-cell');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

let started = false;
let firstMoveDone = false;

function render() {
  const state = game.getState();
  const gameStatus = game.getStatus();
  const score = game.getScore();

  scoreEl.textContent = score;

  let cellIndex = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cellValue = state[r][c];
      const cellEl = cellsEl[cellIndex++];

      cellEl.className = 'field-cell';
      cellEl.textContent = '';

      if (cellValue !== 0) {
        cellEl.classList.add(`field-cell--${cellValue}`);
        cellEl.textContent = cellValue;
      }
    }
  }

  if (gameStatus === 'playing') {
    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  } else if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
    msgStart.classList.add('hidden');
    msgLose.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
  } else if (gameStatus === 'idle') {
    msgStart.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (!started) {
    game.start();
    started = true;
    render();
  } else {
    game.restart();
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');

    started = false;
    firstMoveDone = false;
    render();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const oldState = JSON.stringify(game.getState());

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  const newState = JSON.stringify(game.getState());

  if (oldState !== newState && !firstMoveDone) {
    firstMoveDone = true;
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }

  render();
});

render();
