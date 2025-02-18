import Sprite from '../sprite.js';
import { DayOfTheDeadDrawings } from '../drawings.js';

export default class Wall extends Sprite {
  constructor(x, y, width, height) {
    super(x, y, width, height);
  }

  get type() {
    return 'wall';
  }

  get color() {
    return this.defaultColor;
  }

  set color(value) {
    // Ignore color changes
  }

  get size() {
    return Math.min(this.width, this.height) * 0.6;
  }

  get defaultColor() {
    return '#1E1810'; // Rich brown adobe wall color
  }

  collideWithPlayer(player) {
    return true; // Default behavior: solid wall
  }

  collideWithSoul(soul) {
    return true; // Default behavior: solid wall
  }

  drawImage(ctx) {
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);

    this.drawImage(ctx);

    ctx.restore();
  }
}
