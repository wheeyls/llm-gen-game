import BaseGenerator from './baseGenerator.js';

// Wall type symbols:
// # - basic wall
// D - darkness wall
// F - forgotten wall
// V - void wall
// C - confusion wall
// O - ofrenda/altar wall
// P - portal wall (spirit spawn point)
// E - exit
const DEBUG_MAP = `
########################################
#  #  #  ##    #   ##        E         #
#  #  #  ##    #   ##        #         #
#  #     ##    #   ##        #         #
#  #  #  ##    #   ##        #         #
P  #  #  C     D   F         V         O
#  #  #  ##    #   ##        #         #
#     #  ##    #   ##        #         #
#  #  #  ##    #   ##        #         #
########################################`;

export default class ManualGenerator extends BaseGenerator {
  constructor(width, height, mapString = DEBUG_MAP) {
    super(width, height);
    this.mapString = mapString;
    this.fullMap = this.parseMap(mapString);
  }

  parseMap(mapString) {
    // Split into rows, filter out empty lines
    return mapString.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.split(''));
  }

  generateRoom(x, y) {
    const walls = [];
    const startY = y * 10;
    const startX = x * 10;

    // Extract 10x10 section from the full map
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const mapY = startY + i;
        const mapX = startX + j;
        const cell = this.fullMap[mapY]?.[mapX] || '#';
        
        // Convert ASCII symbols to wall types
        const wallType = {
          '#': 'wall',
          'D': 'darkness',
          'F': 'forgotten',
          'V': 'void',
          'C': 'confusion',
          'O': 'ofrenda',
          'P': 'portal',
          'E': 'exit'
        }[cell];
        
        if (wallType) {
          walls.push(this.createWall(x, y, j, i, wallType));
        }
      }
    }

    return walls;
  }
}
