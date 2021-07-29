"use strict";

// <div show-info="name"></div>
// document.querySelectorAll('[show-info]')

// const tableMatrix = document.getElementById("tabl")
const tableMatrix = document.querySelector('table');
let isRefresh = false;
let baseMatrix = [[1024, 2, null, 4],
[64, null, 32, 8],
[null, 16, 512, 128],
[null, null, null, 2028]];

//транспонируем матрицу
function transposeMatrix() {
  const transpose = matrix => matrix[0].map((col, i) => matrix.map(row => row[i]));   // транспонирование матрицы
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

// удаляем пустоты между числами и прижимаем влево
// let tmp = Array(4).fill(0);
function removeSpacesBetweenNumbers() {
  isRefresh = false;
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
  for (let i = 0; i < tableMatrix.rows.length; i++) {
    let row = tableMatrix.rows[i];
    for (let j = 0; j < row.cells.length; j++) {
      row.cells[j].innerHTML = baseMatrix[i][j];
      if (baseMatrix[i][j]) {
        let ratio = Math.log2(baseMatrix[i][j])
        row.cells[j].style.backgroundColor = `rgba(235, ${ratio * 25}, ${ratio * 5}, 0.8)`;
        row.cells[j].style.fontSize = `${64 - 2 * ratio}px`;
        // row.cells[j].style.cssText = `color: white; font-size: ${48-2*i-2*j}px; background-color:rgb(245, ${j*70}, ${i*10})`;
      } else {
        // row.cells[j].innerHTML = "";
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
        arrayTemp.splice(i + 1, 1);
        arrayTemp.push(...Array(1).fill(null));
        isRefresh = true;
      }
    }
    baseMatrix[k] = arrayTemp;
  }
};

function reverseMatrix() {
    for (let k = 0; k < baseMatrix.length; k++) {
      baseMatrix[k].reverse();
  }
};

baseMatrix = [[2,    2,    4,    4],
              [64,   8,    null, 8],
              [16,   null, null, 16],
              [null, null, 512,  512]];

// removeSpacesBetweenNumbers();
// recalculationMatrix();
// reverseMatrix();
transposeMatrix();
redrawTable();

// baseMatrix = transpose(baseMatrix);
/* redrawTable();
removeSpacesBetweenNumbers();
redrawTable();
randomNumber();
redrawTable(); */
// setTimeout(redrawTable, 2000);
// setTimeout(randomNumber, 3000);
// setTimeout(redrawTable, 4000);
