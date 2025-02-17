import World from './world.js';
import ProceduralGenerator from './worldGenerators/proceduralGenerator.js';
import ManualGenerator from './worldGenerators/manualGenerator.js';
import TransitionWorld from './transitionWorld.js';
import InputManager from './inputManager.js';

export default class Game {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.isTestMode = options.isTestMode || false;

    // Start with transition world
    this.transitionWorld = new TransitionWorld(this.canvas.width, this.canvas.height, () =>
      this.startGameWorld()
    );
    this.gameWorld = null;
    this.currentWorld = this.transitionWorld;

    // Setup input manager
    this.input = new InputManager();

    // Only start game loop if not in test mode
    if (!this.isTestMode) {
      this.lastTime = 0;
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  startGameWorld() {
    const generator = new ManualGenerator(this.canvas.width, this.canvas.height);
    //const generator = new ProceduralGenerator(this.canvas.width, this.canvas.height);
    this.gameWorld = new World(this.canvas.width, this.canvas.height, generator, this);
    this.currentWorld = this.gameWorld;
  }

  gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.step(deltaTime);

    // Schedule next frame if not in test mode
    if (!this.isTestMode) {
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  // Method for testing to manually step the game
  step(deltaTime) {
    // Update and render current world
    this.currentWorld.update(deltaTime);
    this.currentWorld.draw(this.ctx);
  }
}
