export default class BasePrompt {
  constructor() {
    this.visible = true;
    this.selectedIndex = 0;
    this.options = [];
  }

  get height() {
    return 300;
  }

  get width() {
    return 300;
  }

  draw(ctx, x, y) {
    if (!this.visible) return;

    // Draw prompt box
    ctx.fillStyle = '#f0f0f0';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, this.width, this.height);
    ctx.strokeRect(x, y, this.width, this.height);
    let yCursor = 30;

    // Draw title if exists
    if (this.title) {
      yCursor += 30;
      ctx.fillStyle = '#333';
      ctx.font = '16px Arial';
      ctx.fillText(this.title, x + 20, y + yCursor);
    }

    if (this.subtitle) {
      yCursor += 30;
      ctx.fillStyle = '#333';
      ctx.font = '16px Arial';
      ctx.fillText(this.subtitle, x + 20, y + yCursor);
    }

    yCursor += 30;
    // Draw options
    this.options.forEach((option, i) => {
      yCursor += 25;
      ctx.fillStyle = i === this.selectedIndex ? '#0066cc' : '#333';
      ctx.fillText(`> ${option.text}`, x + 30, y + yCursor);
    });
  }

  handleInput(input) {
    if (!this.visible) return null;

    if (input.justUp) {
      this.selectedIndex = Math.max(0, this.selectedIndex - 1);
      return { action: 'select', value: this.selectedIndex };
    }
    if (input.justDown) {
      this.selectedIndex = Math.min(this.options.length - 1, this.selectedIndex + 1);
      return { action: 'select' };
    }
    if (input.justEnter) {
      this.hide();
      return { action: this.options[this.selectedIndex].action };
    }
    if (input.justEscape) {
      this.hide();
      return { action: 'cancel' };
    }
    return null;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
