const pressedKeys = new Set();

window.addEventListener('keydown', (e) => {
  pressedKeys.add(e.key);
  if (
    document.activeElement === document.body &&
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
  ) {
    e.preventDefault();
  }
});

window.addEventListener('keyup', (e) => {
  pressedKeys.delete(e.key);
});

function isKeyPressed(key: string) {
  return pressedKeys.has(key);
}

export { isKeyPressed };
