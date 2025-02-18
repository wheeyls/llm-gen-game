import Sprite from './sprite.js';

export default class Wall extends Sprite {
  static COLORS = {
    wall: '#333333',          // Basic stone wall
    darkness: '#1a0f2e',      // Dark areas needing candle light
    forgotten: '#8e6e95',     // Forgotten memory barriers
    void: '#d4a373',          // Gaps needing marigold bridges  
    confusion: '#7209b7',     // Disorienting memory areas
    ofrenda: '#f72585'        // Destination altar
  };

  constructor(x, y, width, height, type = 'wall') {
    super(x, y, width, height, Wall.COLORS[type] || Wall.COLORS.wall);
    this.type = type;
  }

  draw(ctx) {
    // Base wall drawing
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    const size = Math.min(this.width, this.height) * 0.6;
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);

    switch(this.type) {
      case 'darkness':
        DayOfTheDeadDrawings.sugarSkull(ctx, size);
        break;
      case 'forgotten':
        DayOfTheDeadDrawings.papelPicado(ctx, size, DayOfTheDeadDrawings.colors.pink);
        break;
      case 'void':
        DayOfTheDeadDrawings.marigold(ctx, size, DayOfTheDeadDrawings.colors.orange);
        break;
      case 'confusion':
        DayOfTheDeadDrawings.papelPicado(ctx, size, DayOfTheDeadDrawings.colors.pink);
        break;
      case 'ofrenda':
        // Draw both marigold and candles for altar
        DayOfTheDeadDrawings.marigold(ctx, size, DayOfTheDeadDrawings.colors.orange);
        ctx.translate(0, -size/2);
        DayOfTheDeadDrawings.sugarSkull(ctx, size/2);
        break;
    }

    ctx.restore();
  }
}
