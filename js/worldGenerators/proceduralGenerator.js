import BaseGenerator from './baseGenerator.js';

import ConfusionWall from '../walls/confusionWall.js';
import DarknessWall from '../walls/darknessWall.js';
import ForgottenWall from '../walls/forgottenWall.js';
import OfrendaWall from '../walls/ofrendaWall.js';
import PortalWall from '../walls/portalWall.js';
import VoidWall from '../walls/voidWall.js';
import Wall from '../walls/wall.js';

export default class ProceduralGenerator extends BaseGenerator {
  generateRoom(x, y) {
    const walls = [];

    // Add outer walls except for doors
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // Skip center area
        if (i > 0 && i < 9 && j > 0 && j < 9) continue;

        walls.push(this.createWall(x, y, j, i, Wall));
      }
    }

    // Add exhibit area with security door
    const exhibitStart = 3;
    const exhibitSize = 4;

    // Build exhibit walls
    for (let i = 0; i < exhibitSize; i++) {
      for (let j = 0; j < exhibitSize; j++) {
        if (i === 0 || i === exhibitSize - 1 || j === 0 || j === exhibitSize - 1) {
          walls.push(this.createWall(x, y, exhibitStart + j, exhibitStart + i, Wall));
        }
      }
    }

    // Add exit
    if (x === 2 && y === 2) {
      walls.push(this.createWall(x, y, 4, 4, OfrendaWall));
    }

    // Remove walls for doors based on position
    const doorWidth = 3;
    const doorPos = Math.floor((10 - doorWidth) / 2);

    // Filter out walls where doors should be
    return walls.filter(wall => {
      const localX = Math.round((wall.x - (this.width - 10 * this.cellSize) / 2) / this.cellSize);
      const localY = Math.round((wall.y - (this.height - 10 * this.cellSize) / 2) / this.cellSize);

      // Check if wall is in a door position
      const isDoor =
        (x > 0 && localX === 0 && localY >= doorPos && localY < doorPos + doorWidth) || // Left door
        (x < 2 && localX === 9 && localY >= doorPos && localY < doorPos + doorWidth) || // Right door
        (y > 0 && localY === 0 && localX >= doorPos && localX < doorPos + doorWidth) || // Top door
        (y < 2 && localY === 9 && localX >= doorPos && localX < doorPos + doorWidth); // Bottom door

      return !isDoor;
    });
  }
}
