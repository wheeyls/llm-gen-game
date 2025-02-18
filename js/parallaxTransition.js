import { DayOfTheDeadDrawings } from './drawings.js';

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
        color: DayOfTheDeadDrawings.colors.pink,
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
            DayOfTheDeadDrawings.papelPicado(ctx, element.size, layer.color);
            break;
          case 'marigold':
            DayOfTheDeadDrawings.marigold(ctx, element.size, layer.color);
            break;
          case 'skull':
            DayOfTheDeadDrawings.sugarSkull(ctx, element.size);
            break;
        }

        // Handle wrapping with the same drawing calls
        if (parallaxX < 0) {
          ctx.translate(this.width, 0);
          this.drawElement(ctx, element, layer.color);
        }
        if (parallaxX + element.size > this.width) {
          ctx.translate(-this.width, 0);
          this.drawElement(ctx, element, layer.color);
        }

        ctx.restore();
      });
    });
  }

  drawElement(ctx, element, color) {
    switch(element.type) {
      case 'papel':
        DayOfTheDeadDrawings.papelPicado(ctx, element.size, color);
        break;
      case 'marigold':
        DayOfTheDeadDrawings.marigold(ctx, element.size, color);
        break;
      case 'skull':
        DayOfTheDeadDrawings.sugarSkull(ctx, element.size);
        break;
    }
  }
}
