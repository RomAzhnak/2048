"use strict";

// <div show-info="name"></div>
// document.querySelectorAll('[show-info]')

const score = document.getElementById("score");
const tableMatrix = document.querySelector('table');
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
  // array[0].map((col, i) => array.map(row => row[i]));
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

// let tmp = Array(4).fill(0);
function removeSpacesBetweenNumbers() {
  for (let k = 0; k < baseMatrix.length; k++) {
    let arrayTemp = baseMatrix[k];
    let j = -1;
    for (let i = 0; i < arrayTemp.length; i++) {
      if ((arrayTemp[i]) && (i > j + 1)) {
        j++;
        arrayTemp.splice(j, i - j);
        arrayTemp.push(...Array(i - j).fill(null));
        isRefresh = true;
        i = j;
      }
      if (arrayTemp[i]) {
        j = i;
      }
    }
    baseMatrix[k] = arrayTemp;
  }
};

function redrawTable() {
  let numberFontSize = getComputedStyle(tableMatrix);
  for (let i = 0; i < tableMatrix.rows.length; i++) {
    let row = tableMatrix.rows[i];
    numberFontSize = parseInt(numberFontSize.fontSize);
    for (let j = 0; j < row.cells.length; j++) {
      row.cells[j].innerHTML = baseMatrix[i][j];
      if (baseMatrix[i][j]) {
        let ratio = Math.log2(baseMatrix[i][j])
        row.cells[j].style.backgroundColor = `rgba(235, ${ratio * 25}, ${ratio * 5}, 0.8)`;
        row.cells[j].style.fontSize = `${numberFontSize - 2 * ratio}px`;
        // row.cells[j].style.cssText = `color: white; font-size: ${48-2*i-2*j}px; background-color:rgb(245, ${j*70}, ${i*10})`;
      } else {
        row.cells[j].style.backgroundColor = "";
      }
    }
  }
};

function recalculationMatrix() {
  for (let k = 0; k < baseMatrix.length; k++) {
    let arrayTemp = baseMatrix[k];
    for (let i = 0; i < arrayTemp.length; i++) {
      if (!arrayTemp[i]) {
        break;
      }
      if (arrayTemp[i] == arrayTemp[i + 1]) {
        arrayTemp[i] *= 2;
        totalScore += arrayTemp[i];
        arrayTemp.splice(i + 1, 1);
        arrayTemp.push(...Array(1).fill(null));
        isRefresh = true;
      }
    }
    if (isRefresh) {
      baseMatrix[k] = arrayTemp;
      maxScore = Math.max(...arrayTemp) > maxScore ? Math.max(...arrayTemp) : maxScore;
    }
  }
  isEndGame = (maxScore == 8) ? true : false;
};

function reverseMatrix() {
  for (let k = 0; k < baseMatrix.length; k++) {
    baseMatrix[k].reverse();
  }
};

function moveArrow(event) {
  event.stopImmediatePropagation();
  const keyName = event.key;
  if (!isEndGame) {
    isRefresh = false;
    switch (event.key) {
      case 'ArrowLeft':
        removeSpacesBetweenNumbers();
        recalculationMatrix();
        if (isRefresh) {
          redrawTable();
          score.innerHTML = totalScore;
          if (!isEndGame) {
          randomNumber();
          setTimeout(redrawTable, 150);
          }
        }
        break;
      case 'ArrowRight':
        reverseMatrix();
        removeSpacesBetweenNumbers();
        recalculationMatrix();
        reverseMatrix();
        if (isRefresh) {
          redrawTable();
          score.innerHTML = totalScore;
          if (!isEndGame) {
          randomNumber();
          setTimeout(redrawTable, 150);
          }
        }
        break;
      case 'ArrowUp':
        transposeMatrix();
        removeSpacesBetweenNumbers();
        recalculationMatrix();
        transposeMatrix();
        if (isRefresh) {
          redrawTable();
          score.innerHTML = totalScore;
          if (!isEndGame) {
          randomNumber();
          setTimeout(redrawTable, 150);
          }
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
          redrawTable();
          score.innerHTML = totalScore;
          if (!isEndGame) {
          randomNumber();
          setTimeout(redrawTable, 150);
          }
        }
        break;
    }
  } else {
    alert("Ты выиграл");
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
  randomNumber();
  randomNumber();
  redrawTable();

  // const score = document.getElementById("score");
  // const tableMatrix = document.querySelector('table');
}


window.addEventListener('resize', redrawTable, false);
document.addEventListener('keydown', moveArrow, false);
document.addEventListener('keydown', moveArrow, true);
startGame();
