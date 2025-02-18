import Wall from './wall.js';
import { DayOfTheDeadDrawings } from '../drawings.js';

export default class ForgottenWall extends Wall {
  get defaultColor() {
    return '#8e6e95'; // Forgotten memory barriers
  }

  get type() {
    return 'forgotten';
  }

  collideWithPlayer(player) {
    return false; // Players can pass through
  }

  collideWithSoul(soul) {
    soul.bounce(this); // scares souls
    return false; // not solid to souls
  }

  drawImage(ctx) {
    DayOfTheDeadDrawings.papelPicado(ctx, this.size, DayOfTheDeadDrawings.colors.pink);
  }
}
