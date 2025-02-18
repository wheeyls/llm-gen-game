import Wall from './wall.js';
import { DayOfTheDeadDrawings } from '../drawings.js';

export default class DarknessWall extends Wall {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      angle: Math.random() * Math.PI * 2,
      dispersionSpeed: 0
    }));
    this.isDispelled = false;
    this.dispelTimer = 0;
    this.dispelDuration = 10000; // 10 seconds
    this.opacity = 1;
  }

  get defaultColor() {
    return 'rgba(26, 15, 46, 0.7)'; // Semi-transparent dark purple
  }

  get type() {
    return 'darkness';
  }

  collideWithPlayer(player) {
    if (player.hasCandle() && !this.isDispelled) {
      this.isDispelled = true;
      this.dispelTimer = 0;
      // Initialize particle dispersion
      this.particles.forEach(particle => {
        const dx = particle.x - this.width/2;
        const dy = particle.y - this.height/2;
        const angle = Math.atan2(dy, dx);
        particle.dispersionSpeed = Math.random() * 2 + 1;
        particle.angle = angle;
      });
    }
    return false; // Players can pass through
  }

  collideWithSoul(soul) {
    if (!this.isDispelled) {
      soul.frighten(this); // only frighten when not dispelled
    }
    return false; // not solid to souls
  }

  draw(ctx) {
    // Update dispel effect
    if (this.isDispelled) {
      this.dispelTimer += 16; // Approximate for one frame
      if (this.dispelTimer >= this.dispelDuration) {
        this.isDispelled = false;
        this.opacity = 1;
        // Reset particles
        this.particles.forEach(particle => {
          particle.x = Math.random() * this.width;
          particle.y = Math.random() * this.height;
          particle.dispersionSpeed = 0;
        });
      } else {
        this.opacity = (this.dispelTimer / this.dispelDuration);
      }
    }

    // Override parent draw method completely
    ctx.fillStyle = `rgba(26, 15, 46, ${this.opacity * 0.7})`;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Create dark fog effect
    const gradient = ctx.createRadialGradient(
      this.x + this.width/2, this.y + this.height/2, 0,
      this.x + this.width/2, this.y + this.height/2, this.width/2
    );
    gradient.addColorStop(0, 'rgba(26, 15, 46, 0.1)');
    gradient.addColorStop(1, 'rgba(26, 15, 46, 0.8)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Update and draw particles
    ctx.fillStyle = 'rgba(26, 15, 46, 0.3)';
    ctx.save();
    ctx.translate(this.x, this.y);
    
    this.particles.forEach(particle => {
      // Update particle position
      if (this.isDispelled) {
        // Disperse particles outward
        particle.x += Math.cos(particle.angle) * (particle.speed + particle.dispersionSpeed);
        particle.y += Math.sin(particle.angle) * (particle.speed + particle.dispersionSpeed);
      } else {
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
      }
      
      // Wrap particles around
      if (particle.x < 0) particle.x = this.width;
      if (particle.x > this.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.height;
      if (particle.y > this.height) particle.y = 0;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Add some subtle swirling patterns
    ctx.strokeStyle = 'rgba(26, 15, 46, 0.2)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const time = Date.now() / 2000;
      ctx.beginPath();
      ctx.moveTo(0, this.height/2);
      for (let x = 0; x < this.width; x += 10) {
        const y = this.height/2 + 
                 Math.sin(x/50 + time + i) * 20 + 
                 Math.cos(x/30 - time + i) * 15;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    
    ctx.restore();
  }
}
