import Sprite from './sprite.js';
import Item from './item.js';
import BigSoul from './bigSoul.js';
import Player from './player.js';
import ItemPrompt from './prompts/itemPrompt.js';
import ExitPrompt from './prompts/exitPrompt.js';
import GameState from './gameState.js';
import { ItemProperties } from './itemProperties.js';

export default class World {
  constructor(width, height, generator, game) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.player = new Player(width / 2, height / 2, 32, 32, '#E4A853'); // Warm golden soul color
    this.walls = [];
    this.items = [];
    this.soulCount = 5;
    this.souls = [];
    this.ofrendaPosition = null;
    this.state = new GameState();
    this.itemPrompt = null;
    this.ignoredItems = new Set(); // Track items we're ignoring

    // Grid position (0,0 is left-most room)
    this.gridX = 0;
    this.gridY = 0;

    // Room layout properties
    this.cellSize = Math.min(this.width, this.height) / 10; // Scale cells to smallest canvas dimension

    // Generate rooms using the provided generator
    this.rooms = generator.generateRooms();

    // Initialize room items storage
    this.roomItems = {};

    // Scatter items across all rooms once at the start
    // this.scatterInitialItems();

    // Load initial room
    this.loadCurrentRoom();

    // Resolve any initial collisions
    this.resolveCollisions(this.player);
  }

  loadCurrentRoom() {
    // Load walls directly from room generator
    this.walls = this.rooms[this.gridY][this.gridX];

    // Load items for current room
    const roomKey = `${this.gridX},${this.gridY}`;
    this.items = this.roomItems[roomKey] || [];

    // Add candle to top right corner if room is empty
    if (this.items.length === 0) {
      const candle = new Item(
        this.width - this.cellSize * 2,  // X position
        this.cellSize,                    // Y position
        'candle',
        '#FFD700'  // Golden color for candle
      );
      this.items.push(candle);
      if (!this.roomItems[roomKey]) {
        this.roomItems[roomKey] = [];
      }
      this.roomItems[roomKey].push(candle);
    }

    // Find ofrenda and spawn souls
    this.findOfrendaPosition();

    // Ensure player starts in a safe position in new room
    this.resolveCollisions(this.player);
  }

  findOfrendaPosition() {
    // defaults to center of room if not found
    this.flockTarget = { x: this.cellSize * 15, y: this.cellSize * 5 };

    for (const wall of this.walls) {
      if (wall.type === 'ofrenda') {
        this.flockTarget = {
          x: wall.x + wall.width / 2,
          y: wall.y + wall.height / 2,
        };
        return;
      }
    }
  }

  spawnSoulsAtPortals() {
    const wall = this.walls.find(wall => wall.type === 'portal');

    if (!wall) {
      return;
    }

    if (this.souls.length < this.soulCount) {
      // Check if spawn point is clear
      const spawnBounds = wall.getBounds();
      const expandedBounds = {
        left: spawnBounds.left - this.cellSize,
        right: spawnBounds.right + this.cellSize,
        top: spawnBounds.top - this.cellSize,
        bottom: spawnBounds.bottom + this.cellSize,
      };
      const isClear = !this.souls.find(soul => this.intersects(soul.getBounds(), expandedBounds));

      if (isClear) {
        const soul = new BigSoul(wall.x + wall.width, wall.y, this.cellSize, this);

        this.souls.push(soul);
      }
    }
  }

  checkCollisions(sprite) {
    return this.walls.filter(wall => sprite.intersects(wall));
  }

  resolveCollisions(sprite) {
    const collisions = this.checkCollisions(sprite);

    collisions.forEach(wall => wall.collide(sprite));
  }

  update(deltaTime) {
    this.handleInput(this.game.input);

    switch (this.state.current) {
      case GameState.EXPLORING:
        // Check for item collision
        this.spawnSoulsAtPortals();

        // Update souls
        if (this.flockTarget) {
          // Update souls and handle collisions
          for (let i = this.souls.length - 1; i >= 0; i--) {
            const soul = this.souls[i];
            soul.flock(this.souls, this.flockTarget);
            soul.update(deltaTime);
          }
        }

        break;

      case GameState.ITEM_PROMPT:
        // No movement during prompt
        break;
      case GameState.EXIT_PROMPT:
        break;
    }

    // Resolve any collisions that occurred during movement
    this.resolveCollisions(this.player);
    this.checkItemCollision();
    this.checkSoulCollisions();

    // Check for screen transitions (only through gaps in walls)
    if (this.player.x < 0 && this.gridX > 0) {
      this.gridX--;
      this.player.x = this.width - this.player.width;
      this.loadCurrentRoom();
    }
    if (this.player.x + this.player.width > this.width && this.gridX < 2) {
      this.gridX++;
      this.player.x = 0;
      this.loadCurrentRoom();
    }
    if (this.player.y < 0 && this.gridY > 0) {
      this.gridY--;
      this.player.y = this.height - this.player.height;
      this.loadCurrentRoom();
    }
    if (this.player.y + this.player.height > this.height && this.gridY < 2) {
      this.gridY++;
      this.player.y = 0;
      this.loadCurrentRoom();
    }
  }

  checkSoulCollisions() {
    this.souls.forEach((soul, i) => {
      const collisions = this.checkCollisions(soul);

      collisions.forEach((wall, i) => {
        if (wall.collide(soul) === 'remove') {
          this.souls.splice(i, 1);
        }
      });
    });
  }

  draw(ctx) {
    // Fill with warm background color
    ctx.fillStyle = '#FDF6E3'; // Soft cream background
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw walls
    this.walls.forEach(wall => wall.draw(ctx));

    // Draw souls
    this.souls.forEach(soul => soul.draw(ctx));

    // Draw items
    this.items.forEach(item => item.draw(ctx));

    // Draw player
    this.player.draw(ctx);

    // Draw exit prompt if active
    if (this.exitPrompt) {
      this.exitPrompt.draw(ctx, (this.width - 300) / 2, (this.height - 200) / 2);
    }

    // Draw game state
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Screen: ${this.gridX},${this.gridY}`, 10, 30);

    // Draw inventory
    this.player.drawInventory(ctx, this.width, this.height);

    // Draw item prompt if active
    if (this.itemPrompt) {
      this.itemPrompt.draw(ctx, (this.width - 300) / 2, (this.height - 180) / 2);
    }
  }
}

// Add instance methods to World prototype

World.prototype.checkItemCollision = function () {
  const playerBounds = this.player.getBounds();
  for (let i = this.items.length - 1; i >= 0; i--) {
    const item = this.items[i];
    if (this.intersects(playerBounds, item.getBounds())) {
      // Only show prompt if item isn't being ignored
      if (!this.ignoredItems.has(item)) {
        this.itemPrompt = new ItemPrompt(item);
        this.state.transition(GameState.ITEM_PROMPT, {
          item: item,
          itemIndex: i,
        });
      }
      break;
    } else {
      // Clear ignored status when not touching item
      this.ignoredItems.delete(item);
    }
  }
};

World.prototype.handleInput = function (input) {
  switch (this.state.current) {
    case GameState.EXPLORING:
      // Handle movement using game's input manager
      if (input.isLeft) {
        this.player.move(-1, 0);
      } else if (input.isRight) {
        this.player.move(1, 0);
      }
      if (input.isUp) {
        this.player.move(0, -1);
      } else if (input.isDown) {
        this.player.move(0, 1);
      }
      break;
    case GameState.EXIT_PROMPT:
      const exitResult = this.exitPrompt.handleInput(input);
      if (exitResult) {
        if (exitResult.action === 'exit') {
          // TODO: Transition to next level
          console.log('Exiting level with inventory:', this.inventory);
        } else if (exitResult.action === 'continue') {
          this.state.transition(GameState.EXPLORING);
          this.exitPrompt = null;
        }
      }
      break;

    case GameState.ITEM_PROMPT:
      const result = this.itemPrompt.handleInput(input);
      if (result && result.action === 'select') {
        // Just update the visual selection
        return;
      } else if (result) {
        if (result.action === 'confirm') {
          // Store the old item if there is one
          const oldItem = this.player.addItem(result.value, this.state.stateData.item);

          // Remove item from current room's items
          const roomKey = `${this.gridX},${this.gridY}`;
          const itemIndex = this.roomItems[roomKey].indexOf(this.state.stateData.item);
          if (itemIndex !== -1) {
            this.roomItems[roomKey].splice(itemIndex, 1);
          }
          this.items.splice(this.state.stateData.itemIndex, 1);

          // Drop the old item if there was one
          if (oldItem) {
            // Drop item slightly to the right and down from player
            oldItem.x = this.player.x + this.player.width + 10;
            oldItem.y = this.player.y + this.player.height + 10;
            this.roomItems[roomKey].push(oldItem);
            this.items.push(oldItem);
          }
        } else if (result.action === 'cancel') {
          // Add item to ignored set
          this.ignoredItems.add(this.state.stateData.item);
        }

        // Return to exploring state
        this.state.transition(GameState.EXPLORING);
        this.itemPrompt = null;
      }
      break;
  }
};

World.prototype.intersects = function (bounds1, bounds2) {
  return !(
    bounds1.left >= bounds2.right ||
    bounds1.right <= bounds2.left ||
    bounds1.top >= bounds2.bottom ||
    bounds1.bottom <= bounds2.top
  );
};
