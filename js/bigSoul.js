import Soul from './soul.js';
import { DayOfTheDeadDrawings } from './drawings.js';

export default class BigSoul extends Soul {
  constructor(x, y) {
    super(x, y, 64, 64); // Much bigger than regular souls
    this.maxSpeed = 1.5; // Slower movement
    this.acceleration = 0.05; // More gradual acceleration
    this.confusionDuration = 5000; // Longer confusion
    this.rotation = 0; // For spinning during confusion
    this.shakeAmount = 0; // For confusion shake effect
    this.pathMode = 'horizontal'; // Start with horizontal movement
  }

  flock(souls, target) {
    if (this.confused) {
      // Confused behavior: shake, spin, and wander
      this.rotation += this.confusionIntensity * 0.1;
      this.shakeAmount = Math.sin(Date.now() / 50) * this.confusionIntensity * 5;
      
      // Slow wandering away from target
      const angleFromTarget = Math.atan2(this.y - target.y, this.x - target.x);
      this.velocity.x = Math.cos(angleFromTarget) * 0.5;
      this.velocity.y = Math.sin(angleFromTarget) * 0.5;
    } else {
      // L-shaped path following
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      
      if (this.pathMode === 'horizontal') {
        // Move horizontally first
        if (Math.abs(dx) > 5) {
          this.velocity.x += Math.sign(dx) * 0.1;
          this.velocity.y *= 0.8; // Dampen vertical movement
        } else {
          this.pathMode = 'vertical';
        }
      } else {
        // Then move vertically
        if (Math.abs(dy) > 5) {
          this.velocity.y += Math.sign(dy) * 0.1;
          this.velocity.x *= 0.8; // Dampen horizontal movement
        } else {
          this.pathMode = 'horizontal';
        }
      }
    }

    // Apply standard velocity limiting
    const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
      this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
      this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
    }
  }

  draw(ctx) {
    ctx.save();
    
    // Apply confusion effects
    if (this.confused) {
      ctx.translate(
        this.x + this.width/2 + this.shakeAmount,
        this.y + this.height/2 + this.shakeAmount
      );
      ctx.rotate(this.rotation);
    } else {
      ctx.translate(this.x + this.width/2, this.y + this.height/2);
    }

    // Draw large sugar skull body
    ctx.scale(2, 2);
    DayOfTheDeadDrawings.sugarSkull(ctx, this.width/4);
    
    // Add decorative elements
    const decorSize = this.width/6;
    [-1, 1].forEach(offset => {
      ctx.save();
      ctx.translate(offset * this.width/3, this.height/4);
      DayOfTheDeadDrawings.marigold(ctx, decorSize, DayOfTheDeadDrawings.colors.orange);
      ctx.restore();
    });

    ctx.restore();
  }

  bounce(wall) {
    super.bounce(wall);
    // Reset path mode when bouncing
    this.pathMode = this.velocity.x === 0 ? 'horizontal' : 'vertical';
  }
}
