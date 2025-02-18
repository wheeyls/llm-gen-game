import Wall from './wall.js';
import { DayOfTheDeadDrawings } from '../drawings.js';

export default class PortalWall extends Wall {
  get defaultColor() {
    return '#4A0404'; // Deep red spirit portal
  }

  get type() {
    return 'portal';
  }

  collideWithPlayer(player) {
    return true; // Solid to players
  }

  collideWithSoul(soul) {
    return true;
  }

  drawImage(ctx) {
    DayOfTheDeadDrawings.portal(ctx, this.size);
  }
}
