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

    // Add identifying symbols
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    switch(this.type) {
      case 'darkness':
        ctx.fillText('🕯️', centerX, centerY);  // Candle
        break;
      case 'forgotten':
        ctx.fillText('📷', centerX, centerY);   // Photo
        break;
      case 'void':
        ctx.fillText('🌸', centerX, centerY);   // Flower
        break;
      case 'confusion':
        ctx.fillText('✂️', centerX, centerY);   // Scissors (for papel picado)
        break;
      case 'ofrenda':
        ctx.fillText('🕯️🌸', centerX, centerY); // Altar symbols
        break;
    }

    // Reset text properties
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
}
