class Sprite {
    constructor(x, y, width, height, color = 'red') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 5;
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
