class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Start with transition world
        this.transitionWorld = new TransitionWorld(
            this.canvas.width, 
            this.canvas.height,
            () => this.startGameWorld()
        );
        this.gameWorld = null;
        this.currentWorld = this.transitionWorld;
        
        // Setup keyboard listeners
        window.addEventListener('keydown', (e) => {
            if (this.currentWorld === this.gameWorld) {
                World.keys[e.key] = true;
            } else {
                this.currentWorld.handleInput(e.key);
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (this.currentWorld === this.gameWorld) {
                World.keys[e.key] = false;
            }
        });

        // Start the game loop
        this.lastTime = 0;
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    startGameWorld() {
        this.gameWorld = new World(this.canvas.width, this.canvas.height);
        this.currentWorld = this.gameWorld;
    }

    gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Update and render current world
        this.currentWorld.update(deltaTime);
        this.currentWorld.draw(this.ctx);

        // Schedule next frame
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Start the game when the page loads
window.onload = () => {
    new Game();
};
