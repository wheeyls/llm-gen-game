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
      angle: Math.random() * Math.PI * 2
    }));
  }

  get defaultColor() {
    return 'rgba(26, 15, 46, 0.7)'; // Semi-transparent dark purple
  }

  get type() {
    return 'darkness';
  }

  collideWithPlayer(player) {
    return false; // Players can pass through
  }

  collideWithSoul(soul) {
    soul.bounce(this); // scares souls
    return false; // not solid to souls
  }

  drawImage(ctx) {
    // Create dark fog effect
    const gradient = ctx.createRadialGradient(
      this.width/2, this.height/2, 0,
      this.width/2, this.height/2, this.width/2
    );
    gradient.addColorStop(0, 'rgba(26, 15, 46, 0.1)');
    gradient.addColorStop(1, 'rgba(26, 15, 46, 0.8)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    // Update and draw particles
    ctx.fillStyle = 'rgba(26, 15, 46, 0.3)';
    this.particles.forEach(particle => {
      // Update particle position
      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y += Math.sin(particle.angle) * particle.speed;
      
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
  }
}
