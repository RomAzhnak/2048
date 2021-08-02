"use strict";

const score = document.getElementById("score");
const tableMatrix = document.querySelector('table');

class MoveArrow {
  totalOccupiedCells = 0;
  totalScore = 0;
  maxScore = 0;
  isEndGame = false;
  isRefresh = false;
  baseMatrix = [[null, null, null, null],
                    [null, null, null, null],
                    [null, null, null, null],
                    [null, null, null, null]];

  handleEvent(event) {
    event.preventDefault();
    if (event.type == 'resize') {
      this.redrawTable();
      return;
    }
    if (event.type == 'click') {
      this.startGame();
      return;
    }
    const keyName = event.key;
    if (this.isEndGame) return;
    this.isRefresh = false;
    if (event.key.includes("Arrow")) {
      let method = event.key[0].toLowerCase() + event.key.slice(1);
      this[method](event);
      if (this.isRefresh) {
        this.updateMatrix();
      }
    }
    // }
  }

  arrowLeft() {
    this.removeSpacesBetweenNumbers();
    this.recalculationMatrix();
    // if (this.isRefresh) {
    //   this.updateMatrix();
    // }
  }

  arrowRight() {
    this.reverseMatrix();
    this.removeSpacesBetweenNumbers();
    this.recalculationMatrix();
    this.reverseMatrix();
    // if (this.isRefresh) {
    //   this.updateMatrix();
    // }
  }

  arrowUp() {
    this.transposeMatrix();
    this.removeSpacesBetweenNumbers();
    this.recalculationMatrix();
    this.transposeMatrix();
    // if (this.isRefresh) {
    //   this.updateMatrix();
    // }
  }

  arrowDown() {
    this.transposeMatrix();
    this.reverseMatrix();
    this.removeSpacesBetweenNumbers();
    this.recalculationMatrix();
    this.reverseMatrix();
    this.transposeMatrix();
    // if (this.isRefresh) {
    //   this.updateMatrix();
    // }
  }

  transposeMatrix() {
    const transpose = matrix => matrix[0].map((col, i) => matrix.map(row => row[i]));
    this.baseMatrix = transpose(this.baseMatrix);
  }

  randomNumber() {
    while (true) {
      let value = Math.random() < 0.8 ? 2 : 4;
      let row = Math.floor(Math.random() * 4);
      let column = Math.floor(Math.random() * 4);
      if (this.baseMatrix[row][column] == null) {
        this.baseMatrix[row][column] = value;
        break;
      }
    }
  }

  removeSpacesBetweenNumbers() {
    for (let row = 0; row < this.baseMatrix.length; row++) {
      let rowMatrix = this.baseMatrix[row];
      let j = -1;
      for (let i = 0; i < rowMatrix.length; i++) {
        if ((rowMatrix[i]) && (i > j + 1)) {
          j++;
          rowMatrix.splice(j, i - j);
          rowMatrix.push(...Array(i - j).fill(null));
          this.isRefresh = true;
          i = j;
        }
        if (rowMatrix[i]) {
          j = i;
        }
      }
      this.baseMatrix[row] = rowMatrix;
    }
  }

  redrawTable() {
    this.totalOccupiedCells = 0;
    let numberFontSize = parseInt(getComputedStyle(tableMatrix).fontSize);
    for (let i = 0; i < tableMatrix.rows.length; i++) {
      let row = tableMatrix.rows[i];
      for (let j = 0; j < row.cells.length; j++) {
        row.cells[j].innerHTML = this.baseMatrix[i][j];
        if (this.baseMatrix[i][j]) {
          this.totalOccupiedCells++;
          let ratio = Math.log2(this.baseMatrix[i][j]);
          row.cells[j].style.backgroundColor = `rgba(235, ${ratio * 25}, ${ratio * 5}, 0.8)`;
          row.cells[j].style.fontSize = `${numberFontSize - 2.5 * ratio}px`;
        } else {
          row.cells[j].style.backgroundColor = "";
        }
      }
    }
  }

  recalculationMatrix() {
    for (let row = 0; row < this.baseMatrix.length; row++) {
      let rowMatrix = this.baseMatrix[row];
      for (let i = 0; i < rowMatrix.length; i++) {
        if (!rowMatrix[i]) {
          break;
        }
        if (rowMatrix[i] == rowMatrix[i + 1]) {
          rowMatrix[i] *= 2;
          this.totalScore += rowMatrix[i];
          rowMatrix.splice(i + 1, 1);
          rowMatrix.push(...Array(1).fill(null));
          this.isRefresh = true;
        }
      }
      if (this.isRefresh) {
        this.baseMatrix[row] = rowMatrix;
        this.maxScore = Math.max(...rowMatrix) > this.maxScore ? Math.max(...rowMatrix) : this.maxScore;
      }
    }
    this.isEndGame = (this.maxScore == 2048) ? true : false;
  }

  reverseMatrix() {
    for (let row = 0; row < this.baseMatrix.length; row++) {
      this.baseMatrix[row].reverse();
    }
  }

  showNotification(text) {
    let notification = tableMatrix.querySelector('div');
    if (notification) {
      notification.remove();
    }
    notification = document.createElement('div');
    notification.className = "notification";
    notification.innerHTML = text;
    tabl.prepend(notification);
  }

  lossCheck() {
    if (this.totalOccupiedCells!=16) return;
    this.isRefresh = false;
    let tempMatrix = JSON.parse(JSON.stringify(this.baseMatrix));
    this.arrowLeft();
    this.arrowUp();
    if (this.isRefresh) {
        this.isRefresh = false;
        this.baseMatrix = JSON.parse(JSON.stringify(tempMatrix));
        return;
    }
    this.showNotification("Вы проиграли");    
  }

  updateMatrix() {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    this.redrawTable();
    score.innerHTML = this.totalScore;
    if (!this.isEndGame) {
      this.randomNumber();
      // let boundRedrawTable = this.redrawTable.bind(this);
      // setTimeout(boundRedrawTable, 150);
      // setTimeout(() => this.redrawTable(), 150);
      // delay(1000).then(boundRedrawTable);
      delay(150).then(() => this.redrawTable())
                .then(() => this.lossCheck());
    } else {
      this.showNotification("Вы выиграли");
    }
  }

  startGame() {
    this.totalOccupiedCells = 0;
    this.maxScore = 0;
    this.isRefresh = false;
    this.isEndGame = false;
    this.totalScore = 0;
    score.innerHTML = this.totalScore;  
    this.baseMatrix = [[null, null, null, null],
                       [null, null, null, null],
                       [null, null, null, null],
                       [null, null, null, null]];
    let notification = tabl.querySelector('div');
    if (notification) {
      notification.remove();
    } 
    this.randomNumber();
    this.randomNumber();
    this.redrawTable();
  }

}

const moveArrow = new MoveArrow();
window.addEventListener('resize', moveArrow);
document.addEventListener('keydown', moveArrow);
restartButton.addEventListener('click', moveArrow);
moveArrow.startGame();
