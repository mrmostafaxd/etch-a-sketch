const grid = document.querySelector('#grid');
const resetBtn = document.querySelector('#reset-btn');
const resizeBtn = document.querySelector('#resize-btn');

const gridMaxWidth = parseFloat(window.getComputedStyle(grid).width);

let gridSize = 4;

window.addEventListener('load', AttachGridOnLoad);

grid.addEventListener('mouseover', (evt) => {
  // data-index attribute is used to
  //  assure that only the grid items are colored
  const itemIndex = evt.target.dataset.index;
  if (itemIndex !== undefined) {
    evt.target.style.backgroundColor = 'red';
  }
});

resetBtn.addEventListener('click', resetGrid);

resizeBtn.addEventListener('click', resizeGrid);

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
    alert('Non-numeric input, defaulting to current grid size');
    return null;
  }

  if (+userInput <= 0) {
    alert('grid size must be at least 1');
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

    newGridItem.classList.add('grid-item');

    if (i > gridSize * gridSize - gridSize) {
      newGridItem.classList.add('last-row');
    }

    if (i % gridSize === 0) {
      newGridItem.classList.add('last-in-row');
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
