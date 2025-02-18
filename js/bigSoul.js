import Soul from './soul.js';
import { DayOfTheDeadDrawings } from './drawings.js';

const SOUL_TYPES = ['groom', 'bride', 'abuela'];

export default class BigSoul extends Soul {
  constructor(x, y, cellSize) {
    super(x, y, cellSize, cellSize);
    this.maxSpeed = 1.0;
    this.acceleration = 0.03;
    this.soulType = SOUL_TYPES[Math.floor(Math.random() * SOUL_TYPES.length)];
    this.confusionDuration = 5000;
    this.rotation = 0;
    this.targetRotation = 0;
    this.rotationSpeed = 0.1;
    this.shakeAmount = 0;
    this.pathMode = 'horizontal';
    this.isRotating = false;
    this.movementDelay = 500; // ms to wait after rotation before moving
    this.movementTimer = 0;
  }

  flock(souls, target) {
    const separation = this.getSeparation(souls);
    
    if (this.confused) {
      // Only shake for the first second of confusion
      if (this.confusionTimer < 1000) {
        this.shakeAmount = Math.sin(Date.now() / 30) * this.confusionIntensity * 4;
      } else {
        this.shakeAmount = 0;
      }
      
      // Wander away from target more deliberately
      const angleFromTarget = Math.atan2(this.y - target.y, this.x - target.x);
      this.velocity.x = Math.cos(angleFromTarget) * 0.5;
      this.velocity.y = Math.sin(angleFromTarget) * 0.5;
      return;
    }

    // Apply separation
    this.velocity.x += separation.x * 2.0;
    this.velocity.y += separation.y * 2.0;
    
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    
    // Determine target rotation based on movement direction
    if (this.pathMode === 'horizontal') {
      if (Math.abs(dx) > 5) {
        this.targetRotation = dx > 0 ? 0 : Math.PI;
      } else {
        this.pathMode = 'vertical';
      }
    } else {
      if (Math.abs(dy) > 5) {
        this.targetRotation = dy > 0 ? Math.PI/2 : -Math.PI/2;
      } else {
        this.pathMode = 'horizontal';
      }
    }

    // Rotate towards target rotation
    const rotationDiff = ((this.targetRotation - this.rotation + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    if (Math.abs(rotationDiff) > 0.1) {
      this.isRotating = true;
      this.movementTimer = this.movementDelay;
      this.rotation += rotationDiff * this.rotationSpeed;
      this.velocity.x *= 0.8;
      this.velocity.y *= 0.8;
    } else {
      if (this.isRotating) {
        this.movementTimer -= 16; // Approximate for one frame
        if (this.movementTimer <= 0) {
          this.isRotating = false;
        }
      }
      
      if (!this.isRotating) {
        // Move in current direction
        if (this.pathMode === 'horizontal') {
          this.velocity.x += Math.cos(this.rotation) * 0.1;
          this.velocity.y *= 0.8;
        } else {
          this.velocity.y += Math.sin(this.rotation) * 0.1;
          this.velocity.x *= 0.8;
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
    
    // Apply confusion effects or normal rotation
    if (this.confused) {
      ctx.translate(
        this.x + this.width/2 + this.shakeAmount,
        this.y + this.height/2 + this.shakeAmount
      );
      ctx.rotate(this.targetRotation); // Keep facing same direction while confused
    } else {
      ctx.translate(this.x + this.width/2, this.y + this.height/2);
      ctx.rotate(this.rotation);
    }

    // Draw the specific soul type
    ctx.scale(2, 2);
    switch(this.soulType) {
      case 'groom':
        DayOfTheDeadDrawings.soulGroom(ctx, this.width/4);
        break;
      case 'bride':
        DayOfTheDeadDrawings.soulBride(ctx, this.width/4);
        break;
      case 'abuela':
        DayOfTheDeadDrawings.soulAbuela(ctx, this.width/4);
        break;
    }

    ctx.restore();
  }

  bounce(wall) {
    super.bounce(wall);
    // Reset path mode when bouncing
    this.pathMode = this.velocity.x === 0 ? 'horizontal' : 'vertical';
  }
}
