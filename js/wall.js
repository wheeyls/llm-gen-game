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

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw door number if this is a security door
    if (this.isSecurityDoor()) {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        this.getSecurityLevel(),
        this.x + this.width / 2,
        this.y + this.height / 2
      );
      ctx.textAlign = 'left';  // Reset alignment
      ctx.textBaseline = 'alphabetic';  // Reset baseline
    }
  }

  isSecurityDoor() {
    return this.type.startsWith('door');
  }

  getSecurityLevel() {
    return this.isSecurityDoor() ? parseInt(this.type.slice(4)) : 0;
  }
}
