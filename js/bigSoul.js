import Soul from './soul.js';
import { DayOfTheDeadDrawings } from './drawings.js';
import PathFinder from './pathFinder.js';

const SOUL_TYPES = ['groom', 'bride', 'abuela'];

export default class BigSoul extends Soul {
  constructor(x, y, cellSize, world) {
    super(x, y, cellSize * 0.4, cellSize * 0.4); // Make souls much smaller
    this.maxSpeed = 1.0;
    this.acceleration = 0.03;
    this.soulType = SOUL_TYPES[Math.floor(Math.random() * SOUL_TYPES.length)];
    this.confusionDuration = 5000;
    this.rotation = 0;
    this.targetRotation = 0;
    this.rotationSpeed = 0.1;
    this.shakeAmount = 0;
    this.world = world;
    this.pathFinder = new PathFinder(world);
    this.currentPath = null;
    this.pathIndex = 0;
    this.pathUpdateTimer = 0;
    this.pathUpdateInterval = 1000;
    this.gridSize = cellSize;
    this.isMoving = false;
    this.currentGridX = Math.floor(x / cellSize);
    this.currentGridY = Math.floor(y / cellSize);
    this.targetGridX = this.currentGridX;
    this.targetGridY = this.currentGridY;
    this.souls = world.souls; // Reference to all souls for collision checking
  }

  flock(souls, target) {
    const separation = this.getSeparation(souls);
    
    if (false && this.confused) {
      // Only shake for the first second of confusion
      if (this.confusionTimer < 1000) {
        this.shakeAmount = Math.sin(Date.now() / 30) * this.confusionIntensity * 2;
      } else {
        this.shakeAmount = 0;
      }

      // Wander away from target more deliberately
      const angleFromTarget = Math.atan2(this.y - target.y, this.x - target.x);
      this.velocity.x = Math.cos(angleFromTarget) * 0.5;
      this.velocity.y = Math.sin(angleFromTarget) * 0.5;
      return;
    }

    // Update path periodically or if we don't have one
    this.pathUpdateTimer += 16; // Approximate for one frame
    if (!this.currentPath || this.pathUpdateTimer >= this.pathUpdateInterval) {
      console.log('Attempting to find path from', 
        { x: this.x, y: this.y }, 
        'to', 
        { x: target.x, y: target.y }
      );
      this.currentPath = this.pathFinder.findPath(
        this.x, this.y,
        target.x, target.y
      );
      console.log('Path found:', this.currentPath);
      this.pathIndex = 0;
      this.pathUpdateTimer = 0;
    }

    // If we have a path, follow it grid by grid
    if (this.currentPath && this.pathIndex < this.currentPath.length && !this.isMoving) {
      const nextPoint = this.currentPath[this.pathIndex];
      this.targetGridX = Math.floor(nextPoint.x / this.gridSize);
      this.targetGridY = Math.floor(nextPoint.y / this.gridSize);
      
      // Check if another soul is already moving to or occupying our target position
      const isBlocked = this.souls.some(other => {
        if (other === this) return false;
        
        // Check if other soul is moving to our target
        if (other.isMoving && 
            other.targetGridX === this.targetGridX && 
            other.targetGridY === this.targetGridY) {
          return true;
        }
        
        // Check if other soul is already at our target
        if (other.currentGridX === this.targetGridX && 
            other.currentGridY === this.targetGridY) {
          return true;
        }
        
        return false;
      });

      // Only start moving if the path is clear
      if (!isBlocked && (this.targetGridX !== this.currentGridX || this.targetGridY !== this.currentGridY)) {
        this.isMoving = true;
        
        // Set rotation based on movement direction
        const dx = this.targetGridX - this.currentGridX;
        const dy = this.targetGridY - this.currentGridY;
        this.targetRotation = Math.atan2(dy, dx);
      } else if (isBlocked) {
        // If blocked, try to find a new path
        this.pathUpdateTimer = this.pathUpdateInterval;
      } else {
        this.pathIndex++;
      }
    }

    // Handle grid-based movement
    if (this.isMoving) {
      // Calculate target position accounting for sprite dimensions
      const targetX = this.targetGridX * this.gridSize + (this.gridSize - this.width) / 2;
      const targetY = this.targetGridY * this.gridSize + (this.gridSize - this.height) / 2;
      
      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Rotate towards target rotation
      const rotationDiff = ((this.targetRotation - this.rotation + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      this.rotation += rotationDiff * this.rotationSpeed;

      if (distance < 1) {
        // Snap to grid when very close
        this.x = targetX;
        this.y = targetY;
        this.currentGridX = this.targetGridX;
        this.currentGridY = this.targetGridY;
        this.isMoving = false;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.pathIndex++;
      } else {
        // Move towards target grid position
        this.velocity.x = (dx / distance) * this.maxSpeed;
        this.velocity.y = (dy / distance) * this.maxSpeed;
      }
    }

    // Apply separation from other souls
    this.velocity.x += separation.x;
    this.velocity.y += separation.y;

    // Limit speed
    const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
      this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
      this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
    }
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

    ctx.save();
    ctx.translate(this.x + this.width/2, this.y + this.height/2);
    ctx.rotate(this.rotation);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.width, 0, Math.PI * 2);
    ctx.fill();

    // Draw soul core
    ctx.fillStyle = '#E4A853';
    ctx.beginPath();
    ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
    ctx.fill();

    // Add decorative swirls
    ctx.rotate(Date.now() / 1000);
    DayOfTheDeadDrawings.papelPicado(
      ctx,
      this.width * 1.2,
      'rgba(255, 255, 255, 0.3)'
    );

    ctx.restore();
  }

  bounce(wall) {
    if (!this.confused) {
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.confused = true;
      this.confusionIntensity = 3.0; // Start with high confusion
      this.confusionTimer = 0;
    }
  }
}
