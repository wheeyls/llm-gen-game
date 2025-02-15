class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.world = new World(this.canvas.width, this.canvas.height);
        
        // Setup keyboard listeners
        window.addEventListener('keydown', (e) => {
            World.keys[e.key] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            World.keys[e.key] = false;
        });

        // Start the game loop
        this.lastTime = 0;
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Update game state
        this.world.update(deltaTime);
        
        // Render
        this.world.draw(this.ctx);

        // Schedule next frame
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Start the game when the page loads
window.onload = () => {
    new Game();
};
