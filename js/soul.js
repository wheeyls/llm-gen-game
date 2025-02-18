import Sprite from './sprite.js';
import { DayOfTheDeadDrawings } from './drawings.js';

export default class Soul extends Sprite {
  constructor(x, y, width = 16, height = 16) {
    super(x, y, width, height, '#E4A853');
    this.velocity = { x: 0, y: 0 };
    this.maxSpeed = 2;
    this.trail = [];
    this.maxTrailLength = 10;
  }

  flock(souls, target) {
    const separation = this.getSeparation(souls);
    const cohesion = this.getCohesion(souls);
    const alignment = this.getAlignment(souls);
    const seek = this.seek(target);

    this.velocity.x += separation.x * 0.5 + cohesion.x * 0.3 + alignment.x * 0.2 + seek.x * 0.8;
    this.velocity.y += separation.y * 0.5 + cohesion.y * 0.3 + alignment.y * 0.2 + seek.y * 0.8;

    const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
      this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
      this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
    }
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.trail.unshift({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.pop();
    }
  }

  draw(ctx) {
    // Draw trail
    ctx.beginPath();
    ctx.moveTo(this.trail[0]?.x || this.x, this.trail[0]?.y || this.y);
    for (let i = 1; i < this.trail.length; i++) {
      ctx.lineTo(this.trail[i].x, this.trail[i].y);
    }
    ctx.strokeStyle = '#E4A85380';
    ctx.lineWidth = 2;
    ctx.stroke();

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
}
