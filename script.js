const grid = document.querySelector('#grid');

const gridMaxWidth = parseFloat(window.getComputedStyle(grid).width);

window.addEventListener('load', () => {
  createGrid(100);
});

function createGrid(gridSize) {
  const gridItemSize = gridMaxWidth / gridSize;

  const fragment = document.createDocumentFragment();
  for (let i = 1; i <= gridSize * gridSize; i++) {
    const newGridItem = document.createElement('div');

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
