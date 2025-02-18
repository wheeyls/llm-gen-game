import BaseWall from './baseWall.js';
import { DayOfTheDeadDrawings } from '../drawings.js';

export default class ConfusionWall extends BaseWall {
  constructor(x, y, width, height) {
    super(x, y, width, height, 'confusion');
  }

  collideWithPlayer(player) {
    return false; // Players can pass through
  }

  collideWithSoul(soul) {
    if (!soul.confused) {
      soul.confused = true;
      soul.confusionTimer = 0;
      soul.confusionIntensity = 3.0;
    }
    return false; // Souls can pass through but get confused
  }

  draw(ctx) {
    super.draw(ctx);
    const size = Math.min(this.width, this.height) * 0.6;
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    DayOfTheDeadDrawings.papelPicado(ctx, size, DayOfTheDeadDrawings.colors.pink);
    ctx.restore();
  }
}
