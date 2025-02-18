export default class PathFinder {
  constructor(world) {
    this.world = world;
    this.gridSize = world.cellSize;
  }

  // Convert world coordinates to grid coordinates
  toGridCoord(x, y) {
    const offsetX = (this.world.width - 10 * this.gridSize) / 2;
    const offsetY = (this.world.height - 10 * this.gridSize) / 2;
    return {
      x: Math.floor((x - offsetX) / this.gridSize),
      y: Math.floor((y - offsetY) / this.gridSize)
    };
  }

  // Convert grid coordinates to world coordinates (center of cell)
  toWorldCoord(gridX, gridY) {
    const offsetX = (this.world.width - 10 * this.gridSize) / 2;
    const offsetY = (this.world.height - 10 * this.gridSize) / 2;
    return {
      x: offsetX + (gridX + 0.5) * this.gridSize,
      y: offsetY + (gridY + 0.5) * this.gridSize
    };
  }

  // Check if a grid position is walkable
  isWalkable(gridX, gridY) {
    // Check grid bounds
    if (gridX < 0 || gridX >= 10 || gridY < 0 || gridY >= 10) {
      console.log('Position out of bounds:', { gridX, gridY });
      return false;
    }

    const offsetX = (this.world.width - 10 * this.gridSize) / 2;
    const offsetY = (this.world.height - 10 * this.gridSize) / 2;

    // Create a test bounds in world coordinates
    const bounds = {
      left: offsetX + gridX * this.gridSize,
      right: offsetX + (gridX + 1) * this.gridSize,
      top: offsetY + gridY * this.gridSize,
      bottom: offsetY + (gridY + 1) * this.gridSize
    };

    // Check for wall collisions
    const collision = this.world.walls.find(wall => 
      this.world.intersects(wall.getBounds(), bounds)
    );

    if (collision) {
      console.log('Position not walkable due to wall:', {
        gridPos: { x: gridX, y: gridY },
        worldBounds: bounds,
        wall: collision
      });
      // Allow walking to ofrenda, but not through other walls
      if (collision.type === 'ofrenda') {
        const targetBounds = {
          left: this.world.flockTarget.x - this.gridSize/2,
          right: this.world.flockTarget.x + this.gridSize/2,
          top: this.world.flockTarget.y - this.gridSize/2,
          bottom: this.world.flockTarget.y + this.gridSize/2
        };
        return this.world.intersects(collision.getBounds(), targetBounds);
      }
      return false;
    }

    return true;
  }

  // Get valid neighbors for a grid position
  getNeighbors(node) {
    const neighbors = [];
    const directions = [
      {x: 0, y: -1}, {x: 1, y: 0},
      {x: 0, y: 1}, {x: -1, y: 0}
    ];

    for (const dir of directions) {
      const newX = node.x + dir.x;
      const newY = node.y + dir.y;
      
      if (this.isWalkable(newX, newY)) {
        neighbors.push({x: newX, y: newY});
      }
    }

    return neighbors;
  }

  // Manhattan distance heuristic
  heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  // Find path between two points using A*
  findPath(startX, startY, endX, endY) {
    const start = this.toGridCoord(startX, startY);
    const end = this.toGridCoord(endX, endY);
    
    console.log('PathFinding:', {
      worldStart: { x: startX, y: startY },
      worldEnd: { x: endX, y: endY },
      gridStart: start,
      gridEnd: end
    });

    // Always allow end position if it's the ofrenda
    const endWall = this.world.walls.find(wall => 
      this.world.intersects(wall.getBounds(), {
        left: endX - this.gridSize/2,
        right: endX + this.gridSize/2,
        top: endY - this.gridSize/2,
        bottom: endY + this.gridSize/2
      })
    );

    if (!this.isWalkable(start.x, start.y)) {
      console.log('Start position not walkable:', start);
      return null;
    }
    
    // Allow pathfinding to ofrenda
    if (!this.isWalkable(end.x, end.y) && (!endWall || endWall.type !== 'ofrenda')) {
      console.log('End position not walkable:', end);
      return null;
    }
    
    const openSet = new Set([JSON.stringify(start)]);
    const cameFrom = new Map();
    
    const gScore = new Map();
    gScore.set(JSON.stringify(start), 0);
    
    const fScore = new Map();
    fScore.set(JSON.stringify(start), this.heuristic(start, end));

    while (openSet.size > 0) {
      // Find node with lowest fScore
      let current = null;
      let lowestFScore = Infinity;
      
      for (const pos of openSet) {
        const score = fScore.get(pos);
        if (score < lowestFScore) {
          lowestFScore = score;
          current = JSON.parse(pos);
        }
      }

      if (current.x === end.x && current.y === end.y) {
        // Reconstruct path
        const path = [];
        let curr = current;
        while (curr) {
          path.unshift(this.toWorldCoord(curr.x, curr.y));
          const prevPos = cameFrom.get(JSON.stringify(curr));
          curr = prevPos ? JSON.parse(prevPos) : null;
        }
        return path;
      }

      openSet.delete(JSON.stringify(current));

      for (const neighbor of this.getNeighbors(current)) {
        const neighborPos = JSON.stringify(neighbor);
        const tentativeGScore = gScore.get(JSON.stringify(current)) + 1;

        if (!gScore.has(neighborPos) || tentativeGScore < gScore.get(neighborPos)) {
          cameFrom.set(neighborPos, JSON.stringify(current));
          gScore.set(neighborPos, tentativeGScore);
          fScore.set(neighborPos, tentativeGScore + this.heuristic(neighbor, end));
          openSet.add(neighborPos);
        }
      }
    }

    return null; // No path found
  }
}
