import BaseWall from './baseWall.js';
import { DayOfTheDeadDrawings } from '../drawings.js';

export default class OfrendaWall extends BaseWall {
  constructor(x, y, width, height) {
    super(x, y, width, height, 'ofrenda');
  }

  collideWithPlayer(player) {
    return true; // Solid to players
  }

  collideWithSoul(soul) {
    return 'remove'; // Signal to remove the soul
  }

  draw(ctx) {
    super.draw(ctx);
    const size = Math.min(this.width, this.height) * 0.6;
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    DayOfTheDeadDrawings.ofrenda(ctx, size);
    ctx.restore();
  }
}
