export default class Character {
    constructor(name, imagePath) {
        this.name = name;
        this.image = new Image();
        this.image.src = imagePath;
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.scale = 1;
        this.opacity = 0;
        this.targetOpacity = 1;
    }

    moveTo(x, y, immediate = false) {
        this.targetX = x;
        this.targetY = y;
        if (immediate) {
            this.x = x;
            this.y = y;
        }
    }

    update(deltaTime) {
        // Smooth movement
        this.x += (this.targetX - this.x) * 0.1;
        this.y += (this.targetY - this.y) * 0.1;
        this.opacity += (this.targetOpacity - this.opacity) * 0.1;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        if (this.image.complete) {
            ctx.drawImage(this.image, -this.image.width/2, -this.image.height/2);
        }
        ctx.restore();
    }
}
