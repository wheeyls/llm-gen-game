class Item {
    constructor(x, y, type, color = 'yellow') {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
        this.color = color;
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw item type label
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(this.type[0], this.x + 6, this.y + 14);
    }
}
