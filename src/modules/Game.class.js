'use strict';

class Game {
  constructor(initialState) {
    const defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : defaultState;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomCell();
    this.addRandomCell();
    this.checkEndGame();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomCell() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkEndGame() {
    let has2048 = false;
    let hasEmpty = false;
    let hasMoves = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] >= 2048) {
          has2048 = true;
        }

        if (this.state[r][c] === 0) {
          hasEmpty = true;
        }

        if (c < 3 && this.state[r][c] === this.state[r][c + 1]) {
          hasMoves = true;
        }

        if (r < 3 && this.state[r][c] === this.state[r + 1][c]) {
          hasMoves = true;
        }
      }
    }

    if (has2048) {
      this.status = 'win';
    } else if (!hasEmpty && !hasMoves) {
      this.status = 'lose';
    }
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    let addedScore = 0;

    if (direction === 'left' || direction === 'right') {
      for (let r = 0; r < 4; r++) {
        const row = [];

        for (let c = 0; c < 4; c++) {
          const currC = direction === 'left' ? c : 3 - c;

          if (this.state[r][currC] !== 0) {
            row.push(this.state[r][currC]);
          }
        }

        const newRow = [];
        let i = 0;

        while (i < row.length) {
          if (i + 1 < row.length && row[i] === row[i + 1]) {
            newRow.push(row[i] * 2);
            addedScore += row[i] * 2;
            i += 2;
          } else {
            newRow.push(row[i]);
            i++;
          }
        }

        while (newRow.length < 4) {
          newRow.push(0);
        }

        for (let c = 0; c < 4; c++) {
          const currC = direction === 'left' ? c : 3 - c;

          if (this.state[r][currC] !== newRow[c]) {
            moved = true;
            this.state[r][currC] = newRow[c];
          }
        }
      }
    } else {
      for (let c = 0; c < 4; c++) {
        const col = [];

        for (let r = 0; r < 4; r++) {
          const currR = direction === 'up' ? r : 3 - r;

          if (this.state[currR][c] !== 0) {
            col.push(this.state[currR][c]);
          }
        }

        const newCol = [];
        let i = 0;

        while (i < col.length) {
          if (i + 1 < col.length && col[i] === col[i + 1]) {
            newCol.push(col[i] * 2);
            addedScore += col[i] * 2;
            i += 2;
          } else {
            newCol.push(col[i]);
            i++;
          }
        }

        while (newCol.length < 4) {
          newCol.push(0);
        }

        for (let r = 0; r < 4; r++) {
          const currR = direction === 'up' ? r : 3 - r;

          if (this.state[currR][c] !== newCol[r]) {
            moved = true;
            this.state[currR][c] = newCol[r];
          }
        }
      }
    }

    if (moved) {
      this.score += addedScore;
      this.addRandomCell();
      this.checkEndGame();
    }
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
  }
}

module.exports = Game;
