import Wall from '../wall.js';

export default class BaseGenerator {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cellSize = Math.min(width, height) / 10;
  }

  generateRooms() {
    const rooms = [];
    for (let y = 0; y < 3; y++) {
      rooms[y] = [];
      for (let x = 0; x < 3; x++) {
        rooms[y][x] = this.generateRoom(x, y);
      }
    }
    return rooms;
  }

  generateRoom(x, y) {
    throw new Error('BaseGenerator.generateRoom must be implemented by subclass');
  }

  // Helper method to create wall objects with proper positioning
  createWall(gridX, gridY, cellX, cellY, type = 'wall') {
    const offsetX = (this.width - 10 * this.cellSize) / 2;
    const offsetY = (this.height - 10 * this.cellSize) / 2;
    
    return new Wall(
      offsetX + cellX * this.cellSize,
      offsetY + cellY * this.cellSize,
      this.cellSize,
      this.cellSize,
      type
    );
  }
}
