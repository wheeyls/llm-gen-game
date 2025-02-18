import Sprite from '../sprite.js';
import { DayOfTheDeadDrawings } from '../drawings.js';

export default class BaseWall extends Sprite {
  static COLORS = {
    wall: '#2E1810',          // Rich brown adobe wall color
    darkness: '#1a0f2e',      // Dark areas needing candle light
    forgotten: '#8e6e95',     // Forgotten memory barriers
    void: '#d4a373',          // Gaps needing marigold bridges  
    confusion: '#7209b7',     // Disorienting memory areas
    ofrenda: DayOfTheDeadDrawings.colors.altarPink,  // Destination altar
    portal: '#4A0404'         // Deep red spirit portal
  };

  constructor(x, y, width, height, type = 'wall') {
    super(x, y, width, height, BaseWall.COLORS[type] || BaseWall.COLORS.wall);
    this.type = type;
  }

  collideWithPlayer(player) {
    return true; // Default behavior: solid wall
  }

  collideWithSoul(soul) {
    soul.bounce(this);
    return true; // Default behavior: bounce souls
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
