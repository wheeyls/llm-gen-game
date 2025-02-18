import Sprite from '../sprite.js';
import Player from '../player.js';
import Soul from '../soul.js';
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

  collide(sprite) {
    let result = false;

    if (sprite instanceof Player) {
      result = this.collideWithPlayer(sprite);
    } else if (sprite instanceof Soul) {
      result = this.collideWithSoul(sprite);
    }

    if (result === true) {
      const spriteBox = sprite.getBounds();
      const wallBox = this.getBounds();

      const overlapX = Math.min(spriteBox.right - wallBox.left, wallBox.right - spriteBox.left);
      const overlapY = Math.min(spriteBox.bottom - wallBox.top, wallBox.bottom - spriteBox.top);

      if (overlapX < overlapY) {
        // Push horizontally
        if (spriteBox.left < wallBox.left) {
          sprite.x = wallBox.left - sprite.width;
        } else {
          sprite.x = wallBox.right;
        }
      } else {
        // Push vertically
        if (spriteBox.top < wallBox.top) {
          sprite.y = wallBox.top - sprite.height;
        } else {
          sprite.y = wallBox.bottom;
        }
      }
    }

    return result;
  }

  collideWithPlayer(player) {
    return true; // Default behavior: solid wall
  }

  collideWithSoul(soul) {
    return true; // Default behavior: solid wall
  }

  drawImage(ctx) {}

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
