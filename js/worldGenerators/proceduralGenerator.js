import BaseGenerator from './baseGenerator.js';

export default class ProceduralGenerator extends BaseGenerator {
  generateRoom(x, y) {
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

    // Add exhibit area with security door
    const tier = Math.min(x + y, 3);  // 0-3 tier system
    const doorSymbol = (tier + 1).toString(); // 1=basic, 2=medium, 3=high security

    // Create exhibit room in center
    const exhibitStart = 3;
    const exhibitSize = 4;
    
    // Build exhibit walls
    for (let i = 0; i < exhibitSize; i++) {
      for (let j = 0; j < exhibitSize; j++) {
        if (i === 0 || i === exhibitSize - 1 || j === 0 || j === exhibitSize - 1) {
          room[exhibitStart + i][exhibitStart + j] = '#';
        }
      }
    }
    
    // Add security door
    room[exhibitStart + 2][exhibitStart] = doorSymbol;

    // Add exit to bottom-right room
    if (x === 2 && y === 2) {
      room[4][4] = 'E'; // E still means exit
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
  }
}
