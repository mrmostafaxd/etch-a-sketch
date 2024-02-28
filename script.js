const grid = document.querySelector('#grid');
const btnContainer = document.querySelector('#btn-container');
const modeContainer = document.querySelector('#mode-container');

const resetBtn = document.querySelector('#reset-btn');
const resizeBtn = document.querySelector('#resize-btn');
const toggleBtn = document.querySelector('#toggle-btn');

const colorInputWrapper = document.querySelector('#color-input-wrapper');
const colorInput = document.querySelector('#color-input');

const gridMaxWidth = parseFloat(window.getComputedStyle(grid).width);

let gridSize = 16;
let gridItemColor = '#ff0000';
let gridBordersEnable = false;
let drawingMode = 0; // 0: color mode, 1: rainbow mode, : gray mode

window.addEventListener('load', AttachGridOnLoad);

grid.addEventListener('mouseover', (evt) => {
  // data-index attribute is used to
  //  assure that only the grid items are colored
  const itemIndex = evt.target.dataset.index;
  if (itemIndex !== undefined) {
    colorGridItem(evt.target);
  }
});

modeContainer.addEventListener('click', (evt) => {
  const childDataIndex = evt.target.dataset.index;
  if (childDataIndex !== undefined) {
    drawingMode = +childDataIndex;
    console.log(drawingMode);
    displayCurrentMode();
  }
});

btnContainer.addEventListener('mouseout', (evt) => {
  if (evt.target.tagName === 'BUTTON') {
    evt.target.blur();
  }
});

resetBtn.addEventListener('click', () => {
  resetGrid();
});

resizeBtn.addEventListener('click', resizeGrid);

colorInputWrapper.addEventListener('click', () => {
  colorInput.click();
});

colorInput.addEventListener('change', () => {
  gridItemColor = colorInput.value;
  colorInputWrapper.style.backgroundColor = colorInput.value;
});

toggleBtn.addEventListener('click', () => {
  gridBordersEnable = !gridBordersEnable;

  toggleBtn.classList.toggle('btn-active');
  toggleBtn.blur();
  const gridItems = grid.children;

  grid.style.display = 'none';
  for (const gridItem of gridItems) {
    gridItem.classList.toggle('grid-item');

    const index = gridItem.dataset.index;
    if (index > gridSize * gridSize - gridSize) {
      gridItem.classList.toggle('last-row');
    }

    if (index % gridSize === 0) {
      gridItem.classList.toggle('last-in-row');
    }
  }
  grid.style.display = 'flex';
});

function resizeGrid() {
  const userGridSize = getUserInput();
  if (userGridSize === null) {
    return;
  }
  gridSize = userGridSize;

  const gridFragment = createGrid(gridSize);

  grid.style.display = 'none';

  while (grid.firstChild) {
    grid.firstChild.remove();
  }

  grid.appendChild(gridFragment);

  grid.style.display = 'flex';
}

function getUserInput() {
  const userInput = prompt('Enter grid size (max 100): ');
  if (userInput === null) {
    return null;
  }

  if (userInput === '' || isNaN(+userInput)) {
    alert('Non-numeric input');
    return null;
  }

  if (+userInput <= 0) {
    alert('grid size must be at least 1');
    return null;
  }

  if (+userInput > 100) {
    alert('grid size limit exceeded');
    return null;
  }

  return +userInput;
}

function AttachGridOnLoad() {
  const gridFragment = createGrid(gridSize);

  grid.style.display = 'none';
  grid.appendChild(gridFragment);
  grid.style.display = 'flex';
}

function createGrid(gridSize) {
  const gridItemSize = gridMaxWidth / gridSize;

  const fragment = document.createDocumentFragment();
  for (let i = 1; i <= gridSize * gridSize; i++) {
    const newGridItem = document.createElement('div');

    newGridItem.dataset.index = `${i}`;

    newGridItem.style.width = `${gridItemSize}px`;
    newGridItem.style.height = `${gridItemSize}px`;

    if (gridBordersEnable) {
      newGridItem.classList.add('grid-item');

      if (i > gridSize * gridSize - gridSize) {
        newGridItem.classList.add('last-row');
      }

      if (i % gridSize === 0) {
        newGridItem.classList.add('last-in-row');
      }
    }

    fragment.appendChild(newGridItem);
  }
  return fragment;
}

function resetGrid() {
  // prevent excessive reflows and repaints
  grid.style.display = 'none';
  const gridChildren = grid.children;
  for (const gridItem of gridChildren) {
    gridItem.style.backgroundColor = '';
  }
  grid.style.display = 'flex';
}

function getRandomColor(graymode = false) {
  const red = random(0, 255).toString(16);
  const blue = random(0, 255).toString(16);
  const green = random(0, 255).toString(16);

  return graymode ? `#${red}${red}${red}` : `#${red}${green}${blue}`;
}

function displayCurrentMode() {
  const modeContainerChildren = modeContainer.children;

  for (const child of modeContainerChildren) {
    if (child.dataset.index !== undefined) {
      child.classList.remove('btn-active');
    }
  }

  const activeModeBtn = modeContainer.querySelector(
    `[data-index="${drawingMode}"]`
  );

  activeModeBtn.classList.add('btn-active');
}

function random(min, max) {
  min = Math.floor(min);
  max = Math.ceil(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function colorGridItem(gridItem) {
  switch (drawingMode) {
    case 0: // color mode
    default:
      gridItem.style.backgroundColor = gridItemColor;
      break;
    case 1: // rainbow mode
      gridItem.style.backgroundColor = getRandomColor();
      break;
    case 2: //  gray mode
      gridItem.style.backgroundColor = getRandomColor(true);
      break;
  }
}
