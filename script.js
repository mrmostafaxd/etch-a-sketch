const grid = document.querySelector('#grid');
const resetBtn = document.querySelector('#reset-btn');

const gridMaxWidth = parseFloat(window.getComputedStyle(grid).width);

let gridSize = 100;

window.addEventListener('load', () => {
  createGrid(gridSize);
});

grid.addEventListener('mouseover', (evt) => {
  // data-index attribute is used to
  //  assure that only the grid items are colored
  const itemIndex = evt.target.dataset.index;
  if (itemIndex !== undefined) {
    evt.target.style.backgroundColor = 'red';
  }
});

resetBtn.addEventListener('click', resetGrid);

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
  grid.append(fragment);
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
