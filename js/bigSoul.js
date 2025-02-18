import Soul from './soul.js';
import { DayOfTheDeadDrawings } from './drawings.js';
import PathFinder from './pathFinder.js';

const SOUL_TYPES = ['groom', 'bride', 'abuela'];

export default class BigSoul extends Soul {
  constructor(x, y, cellSize, world) {
    super(x, y, cellSize, cellSize);
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
      
      // Only start moving if we're not already at the target
      if (this.targetGridX !== this.currentGridX || this.targetGridY !== this.currentGridY) {
        this.isMoving = true;
        
        // Set rotation based on movement direction
        const dx = this.targetGridX - this.currentGridX;
        const dy = this.targetGridY - this.currentGridY;
        this.targetRotation = Math.atan2(dy, dx);
      } else {
        this.pathIndex++;
      }
    }

    // Handle grid-based movement
    if (this.isMoving) {
      const targetX = (this.targetGridX + 0.5) * this.gridSize;
      const targetY = (this.targetGridY + 0.5) * this.gridSize;
      
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
    ctx.save();

    // Apply confusion effects or normal rotation
    if (this.confused) {
      ctx.translate(
        this.x + this.width/2 + this.shakeAmount,
        this.y + this.height/2 + this.shakeAmount
      );
      //ctx.rotate(this.targetRotation); // Keep facing same direction while confused
    } else {
      ctx.translate(this.x + this.width/2, this.y + this.height/2);
    }
    ctx.rotate(this.rotation);

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
    if (!this.confused) {
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.confused = true;
      this.confusionIntensity = 3.0; // Start with high confusion
      this.confusionTimer = 0;
    }
  }
}
