export default class InputManager {
  constructor() {
    this.pressedKeys = new Set();
    this.justPressedKeys = new Set();

    window.addEventListener('keydown', e => {
      if (!this.pressedKeys.has(e.key)) {
        this.justPressedKeys.add(e.key);
      }
      this.pressedKeys.add(e.key);
    });

    window.addEventListener('keyup', e => {
      this.pressedKeys.delete(e.key);
      this.justPressedKeys.delete(e.key);
    });

    // Clear keys when window loses focus
    window.addEventListener('blur', () => {
      this.pressedKeys.clear();
      this.justPressedKeys.clear();
    });
  }

  update() {
    // Clear one-shot inputs at the end of each frame
    this.justPressedKeys.clear();
  }

  isPressed(key) {
    return this.pressedKeys.has(key);
  }

  isJustPressed(key) {
    return this.justPressedKeys.has(key);
  }

  isPressed(key) {
    return this.pressedKeys.has(key);
  }

  oneOf(...keys) {
    return keys.find(key => this.isPressed(key));
  }

  get justUp() {
    return this.isJustPressed('ArrowUp') || this.isJustPressed('w') || this.isJustPressed('W');
  }

  get justDown() {
    return this.isJustPressed('ArrowDown') || this.isJustPressed('s') || this.isJustPressed('S');
  }

  get justLeft() {
    return this.isJustPressed('ArrowLeft') || this.isJustPressed('a') || this.isJustPressed('A');
  }

  get justRight() {
    return this.isJustPressed('ArrowRight') || this.isJustPressed('d') || this.isJustPressed('D');
  }

  get justEscape() {
    return this.isJustPressed('Escape');
  }

  get justEnter() {
    return this.isJustPressed('Enter');
  }

  get isUp() {
    return this.isPressed('ArrowUp') || this.isPressed('w') || this.isPressed('W');
  }

  get isDown() {
    return this.isPressed('ArrowDown') || this.isPressed('s') || this.isPressed('S');
  }

  get isLeft() {
    return this.isPressed('ArrowLeft') || this.isPressed('a') || this.isPressed('A');
  }

  get isRight() {
    return this.isPressed('ArrowRight') || this.isPressed('d') || this.isPressed('D');
  }

  get isEnter() {
    return this.isPressed('Enter');
  }

  get isEscape() {
    return this.isPressed('Escape');
  }

  clearAll() {
    this.pressedKeys.clear();
  }
}
