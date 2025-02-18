import Wall from './wall.js';
import { DayOfTheDeadDrawings } from '../drawings.js';

export default class DarknessWall extends Wall {
  get defaultColor() {
    return '#1a0f2e'; // Dark areas needing candle light
  }

  get type() {
    return 'darkness';
  }

  collideWithPlayer(player) {
    return false; // Players can pass through
  }

  collideWithSoul(soul) {
    soul.bounce(this); // scares souls
    return false; // not solid to souls
  }

  drawImage(ctx) {
    DayOfTheDeadDrawings.sugarSkull(ctx, this.size);
  }
}
