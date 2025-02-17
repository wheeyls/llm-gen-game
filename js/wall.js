import Sprite from './sprite.js';

export default class Wall extends Sprite {
  static COLORS = {
    wall: '#333',
    door1: '#4CAF50',  // Basic security - green
    door2: '#FFC107',  // Medium security - yellow
    door3: '#F44336',  // High security - red
    exit: '#4CAF50',   // Exit - green
  };

  constructor(x, y, width, height, type = 'wall') {
    super(x, y, width, height, Wall.COLORS[type] || Wall.COLORS.wall);
    this.type = type;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw text based on type
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
    } else if (this.type === 'exit') {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        'EXIT',
        this.x + this.width / 2,
        this.y + this.height / 2
      );
    }
    
    // Reset text properties
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  isSecurityDoor() {
    return this.type.startsWith('door');
  }

  getSecurityLevel() {
    return this.isSecurityDoor() ? parseInt(this.type.slice(4)) : 0;
  }
}
