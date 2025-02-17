import Sprite from './sprite.js';
import Wall from './wall.js';
import Item from './item.js';
import ItemPrompt from './prompts/itemPrompt.js';
import ExitPrompt from './prompts/exitPrompt.js';
import GameState from './gameState.js';
import { ItemProperties } from './itemProperties.js';

export default class World {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.player = new Sprite(width / 2, height / 2, 32, 32, 'blue');
    this.entities = [];
    this.walls = [];
    this.items = [];
    this.inventory = new Array(5).fill(null);
    this.state = new GameState();
    this.itemPrompt = null;
    this.ignoredItems = new Set(); // Track items we're ignoring

    // Grid position (0,0 is top-left, 2,2 is bottom-right)
    this.gridX = 1;
    this.gridY = 1;

    // Room layout properties
    this.cellSize = Math.min(this.width, this.height) / 10; // Scale cells to smallest canvas dimension

    // Initialize room items storage
    this.roomItems = {};

    // Scatter items across all rooms once at the start
    this.scatterInitialItems();

    this.placeExit();

    // Load initial room
    this.loadCurrentRoom();

    // Resolve any initial collisions
    this.resolveCollisions(this.player);
  }

  loadCurrentRoom() {
    this.walls = [];
    const roomLayout = World.rooms[this.gridY][this.gridX];

    // Calculate offset to center the room
    const offsetX = (this.width - 10 * this.cellSize) / 2;
    const offsetY = (this.height - 10 * this.cellSize) / 2;

    // Load items for current room
    const roomKey = `${this.gridX},${this.gridY}`;
    this.items = this.roomItems[roomKey] || [];

    for (let y = 0; y < roomLayout.length; y++) {
      for (let x = 0; x < roomLayout[y].length; x++) {
        if (roomLayout[y][x] === '#' || roomLayout[y][x] === 'E') {
          this.walls.push(
            new Wall(
              offsetX + x * this.cellSize,
              offsetY + y * this.cellSize,
              this.cellSize,
              this.cellSize
            )
          );
        }
      }
    }

    // Ensure player starts in a safe position in new room
    this.resolveCollisions(this.player);
  }

  checkCollisions(sprite) {
    return this.walls.filter(wall => sprite.intersects(wall));
  }

  resolveCollisions(sprite) {
    const collisions = this.checkCollisions(sprite);

    for (const wall of collisions) {
      const spriteBox = sprite.getBounds();
      const wallBox = wall.getBounds();

      // Calculate overlap on each axis
      const overlapX = Math.min(spriteBox.right - wallBox.left, wallBox.right - spriteBox.left);
      const overlapY = Math.min(spriteBox.bottom - wallBox.top, wallBox.bottom - spriteBox.top);

      // Push out in direction of smallest overlap
      if (overlapX < overlapY) {
        // Push horizontally
        if (spriteBox.left < wallBox.left) {
          sprite.x = wallBox.left - sprite.width;
        } else {
          sprite.x = wallBox.right;
        }
      } else {
        // Push vertically
        if (spriteBox.top < wallBox.top) {
          sprite.y = wallBox.top - sprite.height;
        } else {
          sprite.y = wallBox.bottom;
        }
      }
    }
  }

  update() {
    switch (this.state.current) {
      case GameState.EXPLORING:
        // Handle movement
        if (World.keys.ArrowLeft || World.keys.a || World.keys.A) this.player.move(-1, 0);
        if (World.keys.ArrowRight || World.keys.d || World.keys.D) this.player.move(1, 0);
        if (World.keys.ArrowUp || World.keys.w || World.keys.W) this.player.move(0, -1);
        if (World.keys.ArrowDown || World.keys.s || World.keys.S) this.player.move(0, 1);

        // Check for item collision
        this.checkItemCollision();

        // Check for exit collision in bottom-right room
        if (this.gridX === 2 && this.gridY === 2) {
          this.checkExitCollision();
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

  draw(ctx) {
    // Clear the canvas
    ctx.clearRect(0, 0, this.width, this.height);

    // Draw walls
    this.walls.forEach(wall => wall.draw(ctx));

    // Draw all entities
    this.entities.forEach(entity => entity.draw(ctx));

    // Draw items
    this.items.forEach(item => item.draw(ctx));

    // Draw exit if in bottom-right room
    if (this.gridX === 2 && this.gridY === 2) {
      ctx.fillStyle = '#4CAF50';
      const exitX = (this.width - 10 * this.cellSize) / 2 + 4 * this.cellSize;
      const exitY = (this.height - 10 * this.cellSize) / 2 + 4 * this.cellSize;
      ctx.fillRect(exitX, exitY, this.cellSize, this.cellSize);
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText('EXIT', exitX + 10, exitY + 35);
    }

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
    ctx.fillText(`Moves: ${this.state.movesRemaining}`, 10, 60);
    ctx.fillText(`Security: ${this.state.securityLevel}`, 10, 90);

    // Draw tension meter
    const tension = this.state.culturalTension;
    ctx.fillStyle = tension > 5 ? 'red' : 'orange';
    ctx.fillText(`Cultural Tension: ${tension}`, 10, 120);

    // Draw score
    ctx.fillStyle = 'green';
    ctx.fillText(`Items Returned: ${this.state.itemsReturned}`, 10, 150);

    // Draw inventory
    this.drawInventory(ctx);

    // Draw item prompt if active
    if (this.itemPrompt) {
      this.itemPrompt.draw(ctx, (this.width - 300) / 2, (this.height - 180) / 2);
    }
  }

  // Static keyboard state
  static keys = {};
}

// Room generation and layout
World.generateRoom = function (x, y) {
  let room = [];
  // Initialize with all walls
  for (let i = 0; i < 10; i++) {
    room[i] = new Array(10).fill('#');
  }

  // Clear center area
  for (let i = 1; i < 9; i++) {
    for (let j = 1; j < 9; j++) {
      room[i][j] = ' ';
    }
  }

  // Add center obstacle (2x2 block in middle)
  const centerStart = Math.floor(room.length * 0.4);
  const centerSize = Math.floor(room.length * 0.2);
  for (let i = 0; i < centerSize; i++) {
    for (let j = 0; j < centerSize; j++) {
      room[centerStart + i][centerStart + j] = '#';
    }
  }

  // Add exit to bottom-right room
  if (x === 2 && y === 2) {
    room[4][4] = 'E'; // Place exit in a fixed position
  }

  // Add doors based on position (wider doors)
  const doorWidth = 3;
  const doorPos = Math.floor((room.length - doorWidth) / 2);

  if (x > 0) {
    // Left door
    for (let i = 0; i < doorWidth; i++) {
      room[doorPos + i][0] = ' ';
    }
  }
  if (x < 2) {
    // Right door
    for (let i = 0; i < doorWidth; i++) {
      room[doorPos + i][room.length - 1] = ' ';
    }
  }
  if (y > 0) {
    // Top door
    for (let i = 0; i < doorWidth; i++) {
      room[0][doorPos + i] = ' ';
    }
  }
  if (y < 2) {
    // Bottom door
    for (let i = 0; i < doorWidth; i++) {
      room[room.length - 1][doorPos + i] = ' ';
    }
  }

  // Convert to strings
  return room.map(row => row.join(''));
};

// Generate all rooms
World.rooms = [
  [World.generateRoom(0, 0), World.generateRoom(1, 0), World.generateRoom(2, 0)],
  [World.generateRoom(0, 1), World.generateRoom(1, 1), World.generateRoom(2, 1)],
  [World.generateRoom(0, 2), World.generateRoom(1, 2), World.generateRoom(2, 2)],
];

// Add instance methods to World prototype
World.prototype.drawInventory = function (ctx) {
  const slotSize = 40;
  const padding = 10;
  const startX = this.width - (slotSize + padding) * 5 - padding;
  const startY = this.height - slotSize - padding;

  // Draw inventory slots
  for (let i = 0; i < 5; i++) {
    const x = startX + (slotSize + padding) * i;
    ctx.fillStyle = this.itemPrompt && i === this.itemPrompt.selectedSlot ? '#aaa' : '#ddd';
    ctx.fillRect(x, startY, slotSize, slotSize);
    ctx.strokeStyle = '#333';
    ctx.strokeRect(x, startY, slotSize, slotSize);

    // Draw item if slot is filled
    if (this.inventory[i]) {
      ctx.fillStyle = this.inventory[i].color;
      const itemSize = slotSize * 0.6;
      const itemX = x + (slotSize - itemSize) / 2;
      const itemY = startY + (slotSize - itemSize) / 2;
      ctx.fillRect(itemX, itemY, itemSize, itemSize);

      // Draw item label
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.fillText(this.inventory[i].type[0], itemX + itemSize / 3, itemY + itemSize / 1.5);
    }

    // Draw slot number
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(i + 1, x + 5, startY + slotSize - 5);
  }
};

World.prototype.checkExitCollision = function () {
  const playerBounds = this.player.getBounds();
  const item = this.exit;
  if (this.intersects(playerBounds, item.getBounds())) {
    // move player to be one pixel away from the exit
    this.resolveCollisions(this.player);
    this.exitPrompt = new ExitPrompt(this.inventory);
    this.state.transition(GameState.EXIT_PROMPT);
  }
};

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

World.prototype.handleInput = function (key) {
  switch (this.state.current) {
    case GameState.EXIT_PROMPT:
      const exitResult = this.exitPrompt.handleInput(key);
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
      const result = this.itemPrompt.handleInput(key);
      if (result && result.action === 'select') {
        // Just update the visual selection
        return;
      } else if (result) {
        if (result.action === 'confirm') {
          // Store the old item if there is one
          const oldItem = this.inventory[result.value];

          // Pick up new item
          this.inventory[result.value] = this.state.stateData.item;

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

World.prototype.placeExit = function () {
  this.exit = new Item(4 * this.cellSize, 4 * this.cellSize, 'exit', 'green');
  this.exit.width = this.cellSize;
  this.exit.height = this.cellSize;
};

World.prototype.scatterInitialItems = function () {
  const itemTypes = ['Sword', 'Shield', 'Potion', 'Key', 'Gem'];
  const itemsPerRoom = 3;

  // For each room in the 3x3 grid
  for (let gridY = 0; gridY < 3; gridY++) {
    for (let gridX = 0; gridX < 3; gridX++) {
      const roomLayout = World.rooms[gridY][gridX];
      const offsetX = (this.width - 10 * this.cellSize) / 2;
      const offsetY = (this.height - 10 * this.cellSize) / 2;

      let attempts = 0;
      const maxAttempts = 20;
      let itemsPlaced = 0;
      const roomItems = [];

      // Try to place items in valid positions
      while (itemsPlaced < itemsPerRoom && attempts < maxAttempts) {
        const x = offsetX + (1 + Math.random() * 8) * this.cellSize;
        const y = offsetY + (1 + Math.random() * 8) * this.cellSize;

        // Create temporary walls to check against
        const walls = [];
        for (let y = 0; y < roomLayout.length; y++) {
          for (let x = 0; x < roomLayout[y].length; x++) {
            if (roomLayout[y][x] === '#') {
              walls.push(
                new Wall(
                  offsetX + x * this.cellSize,
                  offsetY + y * this.cellSize,
                  this.cellSize,
                  this.cellSize
                )
              );
            }
          }
        }

        // Create temporary item to check position
        const tempItem = new Item(x, y, 'temp');

        // Check if position is clear
        if (!walls.some(wall => this.intersects(wall.getBounds(), tempItem.getBounds()))) {
          const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
          const item = new Item(x, y, type);

          // Add 2-3 random properties to each item
          const allProperties = Object.values(ItemProperties);
          const propertyCount = 2 + Math.floor(Math.random() * 2);
          for (let i = 0; i < propertyCount; i++) {
            const prop = allProperties[Math.floor(Math.random() * allProperties.length)];
            item.addProperty(prop);
          }

          // Add satirical descriptions based on properties
          if (item.hasProperty(ItemProperties.SUSPICIOUS)) {
            item.description = 'Acquired through completely legitimate means*';
            item.origin = '*Documentation pending';
          } else if (item.hasProperty(ItemProperties.SACRED)) {
            item.description = 'A purely decorative object (ignore the altar marks)';
            item.origin = 'Found in an unlocked temple';
          }

          roomItems.push(item);
          itemsPlaced++;
        }

        attempts++;
      }

      // Store items for this room
      const roomKey = `${gridX},${gridY}`;
      this.roomItems[roomKey] = roomItems;
    }
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
