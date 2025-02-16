export default class Sprite {
    constructor(x, y, width, height, color = 'red') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 5;
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    intersects(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        return !(a.left >= b.right || 
                a.right <= b.left || 
                a.top >= b.bottom ||
                a.bottom <= b.top);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(dx, dy) {
        this.x += dx * this.speed;
        this.y += dy * this.speed;
    }
}
