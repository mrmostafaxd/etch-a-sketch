// elements //
const grid = document.querySelector('#grid');
const btnContainer = document.querySelector('#btn-container');
const modeContainer = document.querySelector('#mode-container');

const colorInputWrapper = document.querySelector('#color-input-wrapper');
const colorInput = document.querySelector('#color-input');

const resetBtn = document.querySelector('#reset-btn');
const toggleBtn = document.querySelector('#toggle-btn');

const resizeRange = document.querySelector('#resize-range');
const resizeLabel = document.querySelector('label[for="resize-range"]');

// variables //
let gridSize = 16;
let gridItemColor = '#ff0000';
let gridBordersEnable = false;

// 0: color mode, 1: rainbow mode, : gray mode,
// 2: darkening mode, 3: lightening mode
let drawingMode = 0;

//event listeners //
window.addEventListener('load', AttachGridOnLoad);

grid.addEventListener('mouseover', (evt) => {
  // data-index attribute is used to
  //  assure that only the grid items are colored
  const itemIndex = evt.target.dataset.index;
  if (itemIndex !== undefined) {
    colorGridItem(evt.target);
  }
});

btnContainer.addEventListener('mouseout', (evt) => {
  if (evt.target.tagName === 'BUTTON') {
    evt.target.blur();
  }
});

modeContainer.addEventListener('click', (evt) => {
  const childDataIndex = evt.target.dataset.index;
  if (childDataIndex !== undefined) {
    drawingMode = +childDataIndex;
    displayCurrentMode();
  }
});

resetBtn.addEventListener('click', () => {
  resetGrid();
});

toggleBtn.addEventListener('click', () => {
  gridBordersEnable = !gridBordersEnable;

  toggleBtn.classList.toggle('btn-active');
  const gridItems = grid.children;

  grid.style.display = 'none';
  toggleGridBorder(gridItems);
  grid.style.display = 'flex';
});

resizeRange.addEventListener('input', () => {
  resizeLabel.textContent = `${resizeRange.value} x ${resizeRange.value}`;
});

resizeRange.addEventListener('change', () => {
  gridSize = resizeRange.value;
  resizeGrid();
  toggleGridBorder(grid.children);
});

colorInputWrapper.addEventListener('click', () => {
  colorInput.click();
});

colorInput.addEventListener('change', () => {
  gridItemColor = colorInput.value;
  colorInputWrapper.style.backgroundColor = colorInput.value;
});

// functions //
function AttachGridOnLoad() {
  const gridFragment = createGridFragment(gridSize);
  toggleGridBorder(gridFragment.children);

  grid.style.display = 'none';
  grid.appendChild(gridFragment);
  grid.style.display = 'flex';
}

function createGridFragment(gridSize) {
  const gridMaxWidth = parseFloat(window.getComputedStyle(grid).width);
  const gridItemSize = gridMaxWidth / gridSize;

  const fragment = document.createDocumentFragment();
  for (let i = 1; i <= gridSize * gridSize; i++) {
    const newGridItem = document.createElement('div');

    newGridItem.dataset.index = `${i}`;

    newGridItem.style.width = `${gridItemSize}px`;
    newGridItem.style.height = `${gridItemSize}px`;
    newGridItem.style.backgroundColor = '#ffffff';

    fragment.appendChild(newGridItem);
  }

  return fragment;
}

function colorGridItem(gridItem) {
  const itemBackgroundColor = gridItem.style.backgroundColor;

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
    case 3: // darkening mode
      let colorObj1 = rgbStringToObject(itemBackgroundColor);
      gridItem.style.backgroundColor = darkenColor(colorObj1);
      break;
    case 4: // lightening mode
      let colorObj2 = rgbStringToObject(itemBackgroundColor);
      gridItem.style.backgroundColor = lightenColor(colorObj2);
      break;
  }
}

function getRandomColor(graymode = false) {
  const red = random(0, 255).toString(16);
  const blue = random(0, 255).toString(16);
  const green = random(0, 255).toString(16);

  return graymode ? `#${red}${red}${red}` : `#${red}${green}${blue}`;
}

function resizeGrid() {
  const gridFragment = createGridFragment(gridSize);

  grid.style.display = 'none';

  while (grid.firstChild) {
    grid.firstChild.remove();
  }

  grid.appendChild(gridFragment);

  grid.style.display = 'flex';
}

function toggleGridBorder(gridItems) {
  for (const gridItem of gridItems) {
    const gridItemIndex = +gridItem.dataset.index;

    gridItem.classList.toggle('grid-item', gridBordersEnable);

    if (gridItemIndex > gridSize * gridSize - gridSize) {
      gridItem.classList.toggle('last-row', gridBordersEnable);
    }

    if (gridItemIndex % gridSize === 0) {
      gridItem.classList.toggle('last-in-row', gridBordersEnable);
    }
  }
}

function resetGrid() {
  // prevent excessive reflows and repaints
  grid.style.display = 'none';
  const gridChildren = grid.children;
  for (const gridItem of gridChildren) {
    gridItem.style.backgroundColor = '#ffffff';
  }
  grid.style.display = 'flex';
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

function darkenColor(rgbColorObj, darkenPercent = 10) {
  const darkenNumber = Math.floor((255 * darkenPercent) / 100);

  const red = Math.max(rgbColorObj.red - darkenNumber, 0);
  const blue = Math.max(rgbColorObj.blue - darkenNumber, 0);
  const green = Math.max(rgbColorObj.green - darkenNumber, 0);

  return `rgb(${red},${blue},${green})`;
}

function lightenColor(rgbColorObj, lightenPercent = 10) {
  const lightenNumber = Math.floor((255 * lightenPercent) / 100);

  const red = Math.min(rgbColorObj.red + lightenNumber, 255);
  const blue = Math.min(rgbColorObj.blue + lightenNumber, 255);
  const green = Math.min(rgbColorObj.green + lightenNumber, 255);

  return `rgb(${red},${blue},${green})`;
}

// converts "rgb(255, 255, 255)" to {255, 255, 255}
function rgbStringToObject(rgbColorString) {
  colorObj.red = parseInt(rgbColorString.split(',')[0].split('(')[1]);
  colorObj.green = parseInt(rgbColorString.split(',')[1].trim());
  colorObj.blue = parseInt(rgbColorString.split(',')[2]);

  return colorObj;
}
