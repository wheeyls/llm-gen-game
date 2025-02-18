import Sprite from './sprite.js';
import { DayOfTheDeadDrawings } from './drawings.js';

export default class Soul extends Sprite {
  constructor(x, y, width = 16, height = 16) {
    super(x, y, width, height, '#E4A853');
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 4; // Increased max speed
    this.acceleration = 0.15; // New acceleration factor
    this.confused = false;
    this.confusionTimer = 0;
    this.confusionDuration = 3000; // 3 seconds of confusion
    this.wanderAngle = Math.random() * Math.PI * 2;
    this.confusionIntensity = 1; // Track how confused the soul is
  }

  flock(souls, target) {
    if (this.confused) {
      // Wander randomly when confused
      // More erratic movement when confused
      this.wanderAngle += (Math.random() - 0.5) * this.confusionIntensity;
      const confusionSpeed = 0.2 * this.confusionIntensity;
      this.velocity.x += Math.cos(this.wanderAngle) * confusionSpeed;
      this.velocity.y += Math.sin(this.wanderAngle) * confusionSpeed;
      
      // Gradually reduce confusion intensity
      this.confusionIntensity = Math.max(1, this.confusionIntensity * 0.99);
    } else {
      const separation = this.getSeparation(souls);
      const cohesion = this.getCohesion(souls);
      const alignment = this.getAlignment(souls);
      const seek = this.seek(target);

      this.velocity.x += separation.x * 0.5 + cohesion.x * 0.3 + alignment.x * 0.2 + seek.x * 0.8;
      this.velocity.y += separation.y * 0.5 + cohesion.y * 0.3 + alignment.y * 0.2 + seek.y * 0.8;
    }

    // Apply acceleration to current velocity
    const targetVelocity = {
      x: this.velocity.x,
      y: this.velocity.y
    };
    
    const speed = Math.sqrt(targetVelocity.x * targetVelocity.x + targetVelocity.y * targetVelocity.y);
    if (speed > this.maxSpeed) {
      targetVelocity.x = (targetVelocity.x / speed) * this.maxSpeed;
      targetVelocity.y = (targetVelocity.y / speed) * this.maxSpeed;
    }
    
    // Smooth acceleration
    this.velocity.x += (targetVelocity.x - this.velocity.x) * this.acceleration;
    this.velocity.y += (targetVelocity.y - this.velocity.y) * this.acceleration;
  }

  update(deltaTime) {
    if (this.confused) {
      this.confusionTimer += deltaTime;
      if (this.confusionTimer >= this.confusionDuration) {
        this.confused = false;
        this.confusionTimer = 0;
      }
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  draw(ctx) {

    // Draw soul glow
    const gradient = ctx.createRadialGradient(
      this.x + this.width/2, this.y + this.height/2, 0,
      this.x + this.width/2, this.y + this.height/2, this.width
    );
    gradient.addColorStop(0, 'rgba(228, 168, 83, 0.8)');
    gradient.addColorStop(0.6, 'rgba(228, 168, 83, 0.3)');
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
    ctx.rotate(Date.now() / 1000);
    DayOfTheDeadDrawings.papelPicado(
      ctx,
      this.width * 1.2,
      'rgba(255, 255, 255, 0.3)'
    );
    ctx.restore();
  }

  seek(target) {
    const desired = {
      x: target.x - this.x,
      y: target.y - this.y
    };
    const distance = Math.sqrt(desired.x * desired.x + desired.y * desired.y);

    if (distance > 0) {
      desired.x = (desired.x / distance) * this.maxSpeed;
      desired.y = (desired.y / distance) * this.maxSpeed;
    }

    return {
      x: desired.x - this.velocity.x,
      y: desired.y - this.velocity.y
    };
  }

  getSeparation(souls) {
    const desiredSeparation = 25;
    const steer = { x: 0, y: 0 };
    let count = 0;

    for (const other of souls) {
      if (other === this) continue;

      const distance = Math.hypot(this.x - other.x, this.y - other.y);

      if (distance > 0 && distance < desiredSeparation) {
        const diff = {
          x: (this.x - other.x) / distance,
          y: (this.y - other.y) / distance
        };
        steer.x += diff.x;
        steer.y += diff.y;
        count++;
      }
    }

    if (count > 0) {
      steer.x /= count;
      steer.y /= count;
    }

    return steer;
  }

  getCohesion(souls) {
    const neighborDist = 50;
    const sum = { x: 0, y: 0 };
    let count = 0;

    for (const other of souls) {
      if (other === this) continue;

      const distance = Math.hypot(this.x - other.x, this.y - other.y);

      if (distance > 0 && distance < neighborDist) {
        sum.x += other.x;
        sum.y += other.y;
        count++;
      }
    }

    if (count > 0) {
      sum.x /= count;
      sum.y /= count;
      return this.seek(sum);
    }
    return { x: 0, y: 0 };
  }

  getAlignment(souls) {
    const neighborDist = 50;
    const sum = { x: 0, y: 0 };
    let count = 0;

    for (const other of souls) {
      if (other === this) continue;

      const distance = Math.hypot(this.x - other.x, this.y - other.y);

      if (distance > 0 && distance < neighborDist) {
        sum.x += other.velocity.x;
        sum.y += other.velocity.y;
        count++;
      }
    }

    if (count > 0) {
      sum.x /= count;
      sum.y /= count;
      const length = Math.sqrt(sum.x * sum.x + sum.y * sum.y);
      if (length > 0) {
        sum.x = (sum.x / length) * this.maxSpeed;
        sum.y = (sum.y / length) * this.maxSpeed;
      }
    }
    return sum;
  }

  // Bounce off walls
  bounce(wall) {
    const bounds = this.getBounds();
    const wallBounds = wall.getBounds();

    // Calculate overlap
    const overlapX = Math.min(bounds.right - wallBounds.left, wallBounds.right - bounds.left);
    const overlapY = Math.min(bounds.bottom - wallBounds.top, wallBounds.bottom - bounds.top);

    // Bounce in direction of smallest overlap
    if (overlapX < overlapY) {
      this.velocity.x *= -0.5; // Reduce bounce velocity
      if (bounds.left < wallBounds.left) {
        this.x = wallBounds.left - this.width;
      } else {
        this.x = wallBounds.right;
      }
    } else {
      this.velocity.y *= -0.5; // Reduce bounce velocity
      if (bounds.top < wallBounds.top) {
        this.y = wallBounds.top - this.height;
      } else {
        this.y = wallBounds.bottom;
      }
    }

    // Enter confused state with high intensity
    this.confused = true;
    this.confusionTimer = 0;
    this.confusionIntensity = 3.0; // Start with high confusion
    // Bounce away from wall at higher speed
    this.velocity.x *= -1.2;
    this.velocity.y *= -1.2;
    this.wanderAngle = Math.atan2(this.velocity.y, this.velocity.x) + 
                       (Math.random() - 0.5) * Math.PI; // Random deviation
  }

  // Get bounds for collision detection
  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }
}
