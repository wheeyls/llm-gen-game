export default class ParallaxTransition {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.position = 0;
    this.targetPosition = 0;
    this.speed = 0.1;
    this.direction = 1;
    this.isTransitioning = false;

    // Parallax layers (background elements that move at different speeds)
    this.layers = [
      { speed: 0.2, color: '#E6CCB2', elements: this.generateElements(3) },
      { speed: 0.5, color: '#DDB892', elements: this.generateElements(5) },
      { speed: 0.8, color: '#B08968', elements: this.generateElements(7) },
    ];
  }

  generateElements(count) {
    return Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: 20 + Math.random() * 40,
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

        ctx.fillStyle = layer.color;
        ctx.fillRect(parallaxX, element.y, element.size, element.size);

        // Draw duplicate for seamless scrolling
        if (parallaxX < 0) {
          ctx.fillRect(parallaxX + this.width, element.y, element.size, element.size);
        }
        if (parallaxX + element.size > this.width) {
          ctx.fillRect(parallaxX - this.width, element.y, element.size, element.size);
        }
      });
    });
  }
}
