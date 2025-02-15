class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.player = new Sprite(width/2, height/2, 32, 32, 'blue');
        this.entities = [];
        this.walls = [];
        
        // Grid position (0,0 is top-left, 2,2 is bottom-right)
        this.gridX = 1;
        this.gridY = 1;
        
        // Room layout properties
        this.cellSize = 80;  // Size of each cell in the room grid
        this.loadCurrentRoom();
        
        // Resolve any initial collisions
        this.resolveCollisions(this.player);
    }

    loadCurrentRoom() {
        this.walls = [];
        const roomLayout = World.rooms[this.gridY][this.gridX];
        
        for (let y = 0; y < roomLayout.length; y++) {
            for (let x = 0; x < roomLayout[y].length; x++) {
                if (roomLayout[y][x] === '#') {
                    this.walls.push(new Wall(
                        x * this.cellSize,
                        y * this.cellSize,
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
        // Store old position for collision resolution
        const oldX = this.player.x;
        const oldY = this.player.y;

        // Handle keyboard input for player movement
        if (World.keys.ArrowLeft) this.player.move(-1, 0);
        if (World.keys.ArrowRight) this.player.move(1, 0);
        if (World.keys.ArrowUp) this.player.move(0, -1);
        if (World.keys.ArrowDown) this.player.move(0, 1);

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

    // Add center obstacle
    room[4][4] = '#';
    room[4][5] = '#';
    room[5][4] = '#';
    room[5][5] = '#';

    // Add doors based on position
    if (x > 0) { // Left door
        room[4][0] = ' ';
        room[5][0] = ' ';
    }
    if (x < 2) { // Right door
        room[4][9] = ' ';
        room[5][9] = ' ';
    }
    if (y > 0) { // Top door
        room[0][4] = ' ';
        room[0][5] = ' ';
    }
    if (y < 2) { // Bottom door
        room[9][4] = ' ';
        room[9][5] = ' ';
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
