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

// Room layouts
World.rooms = [
    // Row 0
    [
        // Parse room layouts from ASCII art
        `##########
#        #
#        #
##      ##
#   ##   #
#   ##   #
##      ##
#        #
#        #
##########`.split('\n'),
        
        `##########
#        #
#        #
##      ##
#   ##   #
#   ##   #
##      ##
#        #
#        #
##########`.split('\n'),
        
        `##########
#        #
#        #
##      ##
#   ##   #
#   ##   #
##      ##
#        #
#        #
##########`.split('\n')
    ],
    // Row 1
    [
        `##########
#        #
#        #
##      ##
#   ##   #
#   ##   #
##      ##
#        #
#        #
##########`.split('\n'),
        
        `##########
#        #
#        #
##      ##
#   ##   #
#   ##   #
##      ##
#        #
#        #
##########`.split('\n'),
        
        `##########
#        #
#        #
##      ##
#   ##   #
#   ##   #
##      ##
#        #
#        #
##########`.split('\n')
    ],
    // Row 2
    [
        `##########
#        #
#        #
##      ##
#   ##   #
#   ##   #
##      ##
#        #
#        #
##########`.split('\n'),
        
        `##########
#        #
#        #
##      ##
#   ##   #
#   ##   #
##      ##
#        #
#        #
##########`.split('\n'),
        
        `##########
#        #
#        #
##      ##
#   ##   #
#   ##   #
##      ##
#        #
#        #
##########`.split('\n')
    ]
];
