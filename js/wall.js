import Sprite from './sprite.js';

export default class Wall extends Sprite {
  static COLORS = {
    wall: '#333',
    door1: '#4CAF50',  // Basic security - green
    door2: '#FFC107',  // Medium security - yellow
    door3: '#F44336',  // High security - red
  };

  constructor(x, y, width, height, type = 'wall') {
    super(x, y, width, height, Wall.COLORS[type] || Wall.COLORS.wall);
    this.type = type;
  }

  isSecurityDoor() {
    return this.type.startsWith('door');
  }

  getSecurityLevel() {
    return this.isSecurityDoor() ? parseInt(this.type.slice(4)) : 0;
  }
}
