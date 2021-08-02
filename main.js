"use strict";

// <div show-info="name"></div>
// document.querySelectorAll('[show-info]')

const score = document.getElementById("score");
const tableMatrix = document.querySelector('table');
// const tableMatrix = document.getElementById('tabl');
let totalScore = 0;
let maxScore = 0;
let isEndGame = false;
let isRefresh = false;
let baseMatrix = [[null, null, null, null],
                  [null, null, null, null],
                  [null, null, null, null],
                  [null, null, null, null]];

function transposeMatrix() {
  const transpose = matrix => matrix[0].map((col, i) => matrix.map(row => row[i]));
  baseMatrix = transpose(baseMatrix);
};

function randomNumber() {
  let value = Math.random() < 0.8 ? 2 : 4;
  let row = Math.floor(Math.random() * 4);
  let column = Math.floor(Math.random() * 4);
  if (!baseMatrix[row][column]) {
    baseMatrix[row][column] = value;
    return;
  }
  randomNumber();
};

function removeSpacesBetweenNumbers() {
  for (let row = 0; row < baseMatrix.length; row++) {
    let rowMatrix = baseMatrix[row];
    let j = -1;
    for (let i = 0; i < rowMatrix.length; i++) {
      if ((rowMatrix[i]) && (i > j + 1)) {
        j++;
        rowMatrix.splice(j, i - j);
        rowMatrix.push(...Array(i - j).fill(null));
        isRefresh = true;
        i = j;
      }
      if (rowMatrix[i]) {
        j = i;
      }
    }
    baseMatrix[row] = rowMatrix;
  }
};

function redrawTable() {
  let numberFontSize = parseInt(getComputedStyle(tableMatrix).fontSize);
  for (let i = 0; i < tableMatrix.rows.length; i++) {
    let row = tableMatrix.rows[i];
    for (let j = 0; j < row.cells.length; j++) {
      row.cells[j].innerHTML = baseMatrix[i][j];
      if (baseMatrix[i][j]) {
        let ratio = Math.log2(baseMatrix[i][j]);
        row.cells[j].style.backgroundColor = `rgba(235, ${ratio * 25}, ${ratio * 5}, 0.8)`;
        row.cells[j].style.fontSize = `${numberFontSize - 2.5 * ratio}px`;
        // row.cells[j].style.cssText = `color: white; font-size: ${48-2*i-2*j}px; background-color:rgb(245, ${j*70}, ${i*10})`;
      } else {
        row.cells[j].style.backgroundColor = "";
      }
    }
  }
};

function recalculationMatrix() {
  for (let row = 0; row < baseMatrix.length; row++) {
    let rowMatrix = baseMatrix[row];
    for (let i = 0; i < rowMatrix.length; i++) {
      if (!rowMatrix[i]) {
        break;
      }
      if (rowMatrix[i] == rowMatrix[i + 1]) {
        rowMatrix[i] *= 2;
        totalScore += rowMatrix[i];
        rowMatrix.splice(i + 1, 1);
        rowMatrix.push(...Array(1).fill(null));
        isRefresh = true;
      }
    }
    if (isRefresh) {
      baseMatrix[row] = rowMatrix;
      maxScore = Math.max(...rowMatrix) > maxScore ? Math.max(...rowMatrix) : maxScore;
    }
  }
  isEndGame = (maxScore == 2048) ? true : false;
};

function reverseMatrix() {
  for (let row = 0; row < baseMatrix.length; row++) {
    baseMatrix[row].reverse();
  }
};

function showNotification(text) {
  let notification = tableMatrix.querySelector('div');
  if (notification) {
    notification.remove();
  }
  notification = document.createElement('div');
  notification.className = "notification";
  notification.innerHTML = text;
  tabl.prepend(notification);
}

function updateMatrix() {
  redrawTable();
  score.innerHTML = totalScore;
  if (!isEndGame) {
  randomNumber();
  setTimeout(redrawTable, 150);
  } else {
    showNotification("Ты выиграл");
  }
};

function moveArrow(event) {
  event.preventDefault();
  const keyName = event.key;
  if (!isEndGame) {
    isRefresh = false;
    switch (event.key) {
      case 'ArrowLeft':
        removeSpacesBetweenNumbers();
        recalculationMatrix();
        if (isRefresh) {
          updateMatrix();
        }
        break;
      case 'ArrowRight':
        reverseMatrix();
        removeSpacesBetweenNumbers();
        recalculationMatrix();
        reverseMatrix();
        if (isRefresh) {
          updateMatrix();
        }
        break;
      case 'ArrowUp':
        transposeMatrix();
        removeSpacesBetweenNumbers();
        recalculationMatrix();
        transposeMatrix();
        if (isRefresh) {
          updateMatrix();
        }
        break;
      case 'ArrowDown':
        transposeMatrix();
        reverseMatrix();
        removeSpacesBetweenNumbers();
        recalculationMatrix();
        reverseMatrix();
        transposeMatrix();
        if (isRefresh) {
          updateMatrix();
        }
        break;
    }
  }
};

function startGame() {
  maxScore = 0;
  isRefresh = false;
  isEndGame = false;
  totalScore = 0;
  score.innerHTML = totalScore;  
  baseMatrix = [[null, null, null, null],
                  [null, null, null, null],
                  [null, null, null, null],
                  [null, null, null, null]];
  let notification = tabl.querySelector('div');
  if (notification) {
    notification.remove();
  } 
  randomNumber();
  randomNumber();
  redrawTable();
}

window.addEventListener('resize', redrawTable);
document.addEventListener('keydown', moveArrow);
restartButton.addEventListener('click', startGame);
startGame();
