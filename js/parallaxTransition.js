export default class ParallaxTransition {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.position = 0;
    this.targetPosition = 0;
    this.speed = 0.1;
    this.direction = 1;
    this.isTransitioning = false;

    // Update layers with Day of the Dead themed elements
    this.layers = [
      { 
        speed: 0.2, 
        color: '#FF69B4',  // Pink papel picado layer
        elements: this.generateElements(8, {
          minSize: 40,
          maxSize: 60,
          type: 'papel'
        }) 
      },
      { 
        speed: 0.5, 
        color: '#FF9636',  // Orange marigold layer
        elements: this.generateElements(12, {
          minSize: 20,
          maxSize: 30,
          type: 'marigold'
        }) 
      },
      { 
        speed: 0.8, 
        color: '#FFFFFF',  // White sugar skull layer
        elements: this.generateElements(6, {
          minSize: 30,
          maxSize: 50,
          type: 'skull'
        }) 
      }
    ];
  }

  generateElements(count, options) {
    return Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: options.minSize + Math.random() * (options.maxSize - options.minSize),
      rotation: Math.random() * Math.PI * 2,
      type: options.type
    }));
  }

  startTransition(forward = true) {
    this.isTransitioning = true;
    this.direction = forward ? 1 : -1;
    this.targetPosition = this.position + this.direction * this.width;
  }

  update(deltaTime) {
    if (!this.isTransitioning) return false;

    this.position += (this.targetPosition - this.position) * this.speed;

    if (Math.abs(this.targetPosition - this.position) < 1) {
      this.position = this.targetPosition;
      this.isTransitioning = false;
      return true; // Transition complete
    }
    return false;
  }

  draw(ctx) {
    // Draw each parallax layer
    this.layers.forEach(layer => {
      layer.elements.forEach(element => {
        const parallaxX = (element.x - this.position * layer.speed) % this.width;

        ctx.save();
        ctx.translate(parallaxX, element.y);
        ctx.rotate(element.rotation);

        // Draw based on element type
        switch(element.type) {
          case 'papel':
            this.drawPapelPicado(ctx, element.size, layer.color);
            break;
          case 'marigold':
            this.drawMarigold(ctx, element.size, layer.color);
            break;
          case 'skull':
            this.drawSugarSkull(ctx, element.size);
            break;
        }

        // Draw duplicate for seamless scrolling
        if (parallaxX < 0) {
          ctx.translate(this.width, 0);
          switch(element.type) {
            case 'papel':
              this.drawPapelPicado(ctx, element.size, layer.color);
              break;
            case 'marigold':
              this.drawMarigold(ctx, element.size, layer.color);
              break;
            case 'skull':
              this.drawSugarSkull(ctx, element.size);
              break;
          }
        }
        if (parallaxX + element.size > this.width) {
          ctx.translate(-this.width, 0);
          switch(element.type) {
            case 'papel':
              this.drawPapelPicado(ctx, element.size, layer.color);
              break;
            case 'marigold':
              this.drawMarigold(ctx, element.size, layer.color);
              break;
            case 'skull':
              this.drawSugarSkull(ctx, element.size);
              break;
          }
        }

        ctx.restore();
      });
    });
  }

  drawPapelPicado(ctx, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    // Draw a decorative banner shape
    ctx.moveTo(-size/2, -size/4);
    ctx.lineTo(size/2, -size/4);
    ctx.lineTo(size/2, size/4);
    ctx.lineTo(0, size/2);
    ctx.lineTo(-size/2, size/4);
    ctx.closePath();
    ctx.fill();
    // Add decorative holes
    ctx.fillStyle = '#42033D';
    ctx.beginPath();
    ctx.arc(0, 0, size/8, 0, Math.PI * 2);
    ctx.fill();
  }

  drawMarigold(ctx, size, color) {
    // Draw marigold flower
    ctx.fillStyle = color;
    for (let i = 0; i < 12; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 12);
      ctx.beginPath();
      ctx.ellipse(size/2, 0, size/4, size/8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Draw center
    ctx.fillStyle = '#42033D';
    ctx.beginPath();
    ctx.arc(0, 0, size/6, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSugarSkull(ctx, size) {
    // Base skull shape
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, size/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Decorative patterns
    ctx.strokeStyle = '#42033D';
    ctx.lineWidth = 2;
    // Eyes
    ctx.beginPath();
    ctx.arc(-size/4, -size/8, size/8, 0, Math.PI * 2);
    ctx.arc(size/4, -size/8, size/8, 0, Math.PI * 2);
    ctx.stroke();
    // Nose
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size/8, size/8);
    ctx.lineTo(size/8, size/8);
    ctx.closePath();
    ctx.stroke();
    // Decorative swirls
    ctx.beginPath();
    ctx.arc(-size/3, size/4, size/8, 0, Math.PI);
    ctx.arc(size/3, size/4, size/8, 0, Math.PI);
    ctx.stroke();
  }
}
