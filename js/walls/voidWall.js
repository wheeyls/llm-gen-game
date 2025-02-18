import Wall from './wall.js';
import { DayOfTheDeadDrawings } from '../drawings.js';

export default class VoidWall extends Wall {
  get defaultColor() {
    return '#d4a373'; // Gaps needing marigold bridges
  }

  get type() {
    return 'void';
  }

  collideWithPlayer(player) {
    return true; // Solid to players
  }

  collideWithSoul(soul) {
    return true; // Solid to players
  }

  drawImage(ctx) {
    DayOfTheDeadDrawings.marigold(ctx, this.size, DayOfTheDeadDrawings.colors.orange);
  }
}
