export default class Dialog {
  constructor(text, options = []) {
    this.text = text;
    this.options = options;
    this.selectedOption = 0;
  }

  draw(ctx, x, y) {
    // Draw dialog box
    ctx.fillStyle = '#f0f0f0';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, 500, 150);
    ctx.strokeRect(x, y, 500, 150);

    // Draw text
    ctx.fillStyle = '#333';
    ctx.font = '18px "Courier New", monospace';
    ctx.fillText(this.text, x + 20, y + 40);

    // Draw options
    this.options.forEach((option, index) => {
      ctx.fillStyle = index === this.selectedOption ? '#0066cc' : '#333';
      ctx.fillText(`> ${option.text}`, x + 30, y + 80 + index * 25);
    });
  }

  handleInput(key) {
    if (key === 'ArrowUp' || key === 'w' || key === 'W') {
      this.selectedOption = Math.max(0, this.selectedOption - 1);
      return null;
    }
    if (key === 'ArrowDown' || key === 's' || key === 'S') {
      this.selectedOption = Math.min(this.options.length - 1, this.selectedOption + 1);
      return null;
    }
    if (key === 'Enter' && this.options.length > 0) {
      return this.options[this.selectedOption];
    }
    return null;
  }
}
