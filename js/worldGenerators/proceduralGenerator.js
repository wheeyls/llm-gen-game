import BaseGenerator from './baseGenerator.js';

export default class ProceduralGenerator extends BaseGenerator {
  generateRoom(x, y) {
    const walls = [];
    
    // Add outer walls except for doors
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // Skip center area
        if (i > 0 && i < 9 && j > 0 && j < 9) continue;
        
        walls.push(this.createWall(x, y, j, i, 'wall'));
      }
    }

    // Add exhibit area with security door
    const tier = Math.min(x + y, 3);  // 0-3 tier system
    const exhibitStart = 3;
    const exhibitSize = 4;
    
    // Build exhibit walls
    for (let i = 0; i < exhibitSize; i++) {
      for (let j = 0; j < exhibitSize; j++) {
        if (i === 0 || i === exhibitSize - 1 || j === 0 || j === exhibitSize - 1) {
          walls.push(this.createWall(x, y, exhibitStart + j, exhibitStart + i, 'wall'));
        }
      }
    }
    
    // Add security door
    walls.push(this.createWall(x, y, exhibitStart, exhibitStart + 2, `door${tier + 1}`));

    // Add exit to bottom-right room
    if (x === 2 && y === 2) {
      walls.push(this.createWall(x, y, 4, 4, 'exit'));
    }

    // Remove walls for doors based on position
    const doorWidth = 3;
    const doorPos = Math.floor((10 - doorWidth) / 2);

    // Filter out walls where doors should be
    return walls.filter(wall => {
      const localX = Math.round((wall.x - ((this.width - 10 * this.cellSize) / 2)) / this.cellSize);
      const localY = Math.round((wall.y - ((this.height - 10 * this.cellSize) / 2)) / this.cellSize);
      
      // Check if wall is in a door position
      const isDoor = (
        (x > 0 && localX === 0 && localY >= doorPos && localY < doorPos + doorWidth) || // Left door
        (x < 2 && localX === 9 && localY >= doorPos && localY < doorPos + doorWidth) || // Right door
        (y > 0 && localY === 0 && localX >= doorPos && localX < doorPos + doorWidth) || // Top door
        (y < 2 && localY === 9 && localX >= doorPos && localX < doorPos + doorWidth)    // Bottom door
      );
      
      return !isDoor;
    });
  }
}
