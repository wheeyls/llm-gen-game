class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.player = new Sprite(width/2, height/2, 32, 32, 'blue');
        this.entities = [];
    }

    update() {
        // Handle keyboard input for player movement
        if (World.keys.ArrowLeft) this.player.move(-1, 0);
        if (World.keys.ArrowRight) this.player.move(1, 0);
        if (World.keys.ArrowUp) this.player.move(0, -1);
        if (World.keys.ArrowDown) this.player.move(0, 1);

        // Keep player in bounds
        this.player.x = Math.max(0, Math.min(this.width - this.player.width, this.player.x));
        this.player.y = Math.max(0, Math.min(this.height - this.player.height, this.player.y));
    }

    draw(ctx) {
        // Clear the canvas
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw all entities
        this.entities.forEach(entity => entity.draw(ctx));
        
        // Draw player
        this.player.draw(ctx);
    }
}

// Static keyboard state
World.keys = {};
