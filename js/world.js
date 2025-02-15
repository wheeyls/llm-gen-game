class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.player = new Sprite(width/2, height/2, 32, 32, 'blue');
        this.entities = [];
        this.walls = [];
        this.items = [];
        this.inventory = new Array(5).fill(null);
        this.state = new GameState();
        this.itemPrompt = null;

        // Grid position (0,0 is top-left, 2,2 is bottom-right)
        this.gridX = 1;
        this.gridY = 1;

        // Room layout properties
        this.cellSize = Math.min(this.width, this.height) / 10;  // Scale cells to smallest canvas dimension
        this.loadCurrentRoom();

        // Resolve any initial collisions
        this.resolveCollisions(this.player);
    }

    loadCurrentRoom() {
        this.walls = [];
        this.items = [];
        const roomLayout = World.rooms[this.gridY][this.gridX];

        // Calculate offset to center the room
        const offsetX = (this.width - (10 * this.cellSize)) / 2;
        const offsetY = (this.height - (10 * this.cellSize)) / 2;

        // Add some random items to the room
        const itemTypes = ['Sword', 'Shield', 'Potion', 'Key', 'Gem'];
        for (let i = 0; i < 3; i++) {
            const x = offsetX + (1 + Math.random() * 8) * this.cellSize;
            const y = offsetY + (1 + Math.random() * 8) * this.cellSize;
            const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            this.items.push(new Item(x, y, type));
        }

        for (let y = 0; y < roomLayout.length; y++) {
            for (let x = 0; x < roomLayout[y].length; x++) {
                if (roomLayout[y][x] === '#') {
                    this.walls.push(new Wall(
                        offsetX + (x * this.cellSize),
                        offsetY + (y * this.cellSize),
                        this.cellSize,
                        this.cellSize
                    ));
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
                if (World.keys.ArrowLeft) this.player.move(-1, 0);
                if (World.keys.ArrowRight) this.player.move(1, 0);
                if (World.keys.ArrowUp) this.player.move(0, -1);
                if (World.keys.ArrowDown) this.player.move(0, 1);

                // Check for item collision
                this.checkItemCollision();
                break;

            case GameState.ITEM_PROMPT:
                // No movement during prompt
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

        // Draw player
        this.player.draw(ctx);

        // Draw screen coordinates
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.fillText(`Screen: ${this.gridX},${this.gridY}`, 10, 30);

        // Draw inventory
        this.drawInventory(ctx);

        // Draw item prompt if active
        if (this.itemPrompt) {
            this.itemPrompt.draw(ctx,
                (this.width - 300) / 2,
                (this.height - 180) / 2
            );
        }
    }
}

// Static keyboard state
World.keys = {};

// Room generation and layout
World.generateRoom = function(x, y) {
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

    // Add doors based on position (wider doors)
    const doorWidth = 3;
    const doorPos = Math.floor((room.length - doorWidth) / 2);

    if (x > 0) { // Left door
        for (let i = 0; i < doorWidth; i++) {
            room[doorPos + i][0] = ' ';
        }
    }
    if (x < 2) { // Right door
        for (let i = 0; i < doorWidth; i++) {
            room[doorPos + i][room.length - 1] = ' ';
        }
    }
    if (y > 0) { // Top door
        for (let i = 0; i < doorWidth; i++) {
            room[0][doorPos + i] = ' ';
        }
    }
    if (y < 2) { // Bottom door
        for (let i = 0; i < doorWidth; i++) {
            room[room.length - 1][doorPos + i] = ' ';
        }
    }

    // Convert to strings
    return room.map(row => row.join(''));
};

// Generate all rooms
World.rooms = [
    [
        World.generateRoom(0, 0),
        World.generateRoom(1, 0),
        World.generateRoom(2, 0)
    ],
    [
        World.generateRoom(0, 1),
        World.generateRoom(1, 1),
        World.generateRoom(2, 1)
    ],
    [
        World.generateRoom(0, 2),
        World.generateRoom(1, 2),
        World.generateRoom(2, 2)
    ]
];

// Add instance methods to World prototype
World.prototype.drawInventory = function(ctx) {
        const slotSize = 40;
        const padding = 10;
        const startX = this.width - (slotSize + padding) * 5 - padding;
        const startY = this.height - slotSize - padding;

        // Draw inventory slots
        for (let i = 0; i < 5; i++) {
            const x = startX + (slotSize + padding) * i;
            ctx.fillStyle = i === this.selectedInventorySlot ? '#aaa' : '#ddd';
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
                ctx.fillText(this.inventory[i].type[0], itemX + itemSize/3, itemY + itemSize/1.5);
            }

            // Draw slot number
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.fillText(i + 1, x + 5, startY + slotSize - 5);
        }
    }

World.prototype.checkItemCollision = function() {
        const playerBounds = this.player.getBounds();
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (this.intersects(playerBounds, item.getBounds())) {
                this.itemPrompt = new ItemPrompt(item);
                this.state.transition(GameState.ITEM_PROMPT, {
                    item: item,
                    itemIndex: i
                });
                break;
            }
        }
    }

World.prototype.handleInput = function(key) {
        switch (this.state.current) {
            case GameState.ITEM_PROMPT:
                const result = this.itemPrompt.handleInput(key);
                if (result) {
                    if (result.action === 'confirm') {
                        // If selected slot has an item, drop it
                        if (this.inventory[result.slot]) {
                            const oldItem = this.inventory[result.slot];
                            oldItem.x = this.player.x;
                            oldItem.y = this.player.y;
                            this.items.push(oldItem);
                        }

                        // Pick up new item
                        this.inventory[result.slot] = this.state.stateData.item;
                        this.items.splice(this.state.stateData.itemIndex, 1);
                    }
                    
                    // Return to exploring state
                    this.state.transition(GameState.EXPLORING);
                    this.itemPrompt = null;
                }
                break;
        }
    }

World.prototype.intersects = function(bounds1, bounds2) {
        return !(bounds1.left >= bounds2.right ||
                bounds1.right <= bounds2.left ||
                bounds1.top >= bounds2.bottom ||
                bounds1.bottom <= bounds2.top);
    }
