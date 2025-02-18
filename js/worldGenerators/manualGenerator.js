import BaseGenerator from './baseGenerator.js';

const DEBUG_MAP = `
###############################
#     1  ##     2  ##     3  E
#   ###  ##   ###  ##   ###  #
#   #    ##   #    ##   #    #
#####    ######    ######    #
#                            #
#        ##        ##        #
#        ##        ##        #
#        ##        ##        #
##############################`;

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
        
        if (cell === '#') {
          walls.push(this.createWall(x, y, j, i, 'wall'));
        } else if (cell === '1' || cell === '2' || cell === '3') {
          walls.push(this.createWall(x, y, j, i, `door${cell}`));
        } else if (cell === 'E') {
          walls.push(this.createWall(x, y, j, i, 'exit'));
        }
      }
    }

    return walls;
  }
}
