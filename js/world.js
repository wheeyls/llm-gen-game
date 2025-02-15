class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.player = new Sprite(width/2, height/2, 32, 32, 'blue');
        this.entities = [];
        
        // Grid position (0,0 is top-left, 2,2 is bottom-right)
        this.gridX = 1;
        this.gridY = 1;
    }

    update() {
        // Handle keyboard input for player movement
        if (World.keys.ArrowLeft) this.player.move(-1, 0);
        if (World.keys.ArrowRight) this.player.move(1, 0);
        if (World.keys.ArrowUp) this.player.move(0, -1);
        if (World.keys.ArrowDown) this.player.move(0, 1);

        // Check for screen transitions
        if (this.player.x < 0 && this.gridX > 0) {
            this.gridX--;
            this.player.x = this.width - this.player.width;
        }
        if (this.player.x + this.player.width > this.width && this.gridX < 2) {
            this.gridX++;
            this.player.x = 0;
        }
        if (this.player.y < 0 && this.gridY > 0) {
            this.gridY--;
            this.player.y = this.height - this.player.height;
        }
        if (this.player.y + this.player.height > this.height && this.gridY < 2) {
            this.gridY++;
            this.player.y = 0;
        }

        // Keep player in bounds only at grid edges
        if (this.gridX === 0) {
            this.player.x = Math.max(0, this.player.x);
        }
        if (this.gridX === 2) {
            this.player.x = Math.min(this.width - this.player.width, this.player.x);
        }
        if (this.gridY === 0) {
            this.player.y = Math.max(0, this.player.y);
        }
        if (this.gridY === 2) {
            this.player.y = Math.min(this.height - this.player.height, this.player.y);
        }
    }

    draw(ctx) {
        // Clear the canvas
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw all entities
        this.entities.forEach(entity => entity.draw(ctx));
        
        // Draw player
        this.player.draw(ctx);

        // Draw screen coordinates
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.fillText(`Screen: ${this.gridX},${this.gridY}`, 10, 30);
    }
}

// Static keyboard state
World.keys = {};
