export default class InputManager {
  constructor() {
    this.pressedKeys = new Set();
    
    window.addEventListener('keydown', e => {
      this.pressedKeys.add(e.key);
    });

    window.addEventListener('keyup', e => {
      this.pressedKeys.delete(e.key);
    });

    // Clear keys when window loses focus
    window.addEventListener('blur', () => {
      this.pressedKeys.clear();
    });
  }

  isPressed(key) {
    return this.pressedKeys.has(key);
  }

  clearAll() {
    this.pressedKeys.clear();
  }
}
