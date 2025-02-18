import Sprite from './sprite.js';
import { DayOfTheDeadDrawings } from './drawings.js';

export default class Soul extends Sprite {
  constructor(x, y, width = 32, height = 32) {
    super(x, y, width, height, '#E4A853'); // Warm golden soul color
    this.speed = 2;
    this.targetX = x;
    this.targetY = y;
    this.isMoving = false;
  }

  moveTo(x, y) {
    this.targetX = x;
    this.targetY = y;
    this.isMoving = true;
  }

  update() {
    if (!this.isMoving) return;

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.speed) {
      // Close enough, snap to target
      this.x = this.targetX;
      this.y = this.targetY;
      this.isMoving = false;
    } else {
      // Move towards target
      const angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * this.speed;
      this.y += Math.sin(angle) * this.speed;
    }
  }

  draw(ctx) {
    // Draw soul glow
    const gradient = ctx.createRadialGradient(
      this.x + this.width/2, this.y + this.height/2, 0,
      this.x + this.width/2, this.y + this.height/2, this.width
    );
    gradient.addColorStop(0, 'rgba(228, 168, 83, 0.6)');
    gradient.addColorStop(1, 'rgba(228, 168, 83, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
      this.x + this.width/2,
      this.y + this.height/2,
      this.width,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw soul core
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.x + this.width/2,
      this.y + this.height/2,
      this.width/2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Add decorative swirls
    ctx.save();
    ctx.translate(this.x + this.width/2, this.y + this.height/2);
    ctx.rotate(Date.now() / 1000); // Slow rotation
    DayOfTheDeadDrawings.papelPicado(
      ctx,
      this.width * 1.2,
      'rgba(255, 255, 255, 0.3)'
    );
    ctx.restore();
  }
}
