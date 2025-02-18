import Sprite from './sprite.js';

export default class Player extends Sprite {
  constructor(x, y, width, height, color) {
    super(x, y, width, height, color);
    this.inventory = new Array(5).fill(null);
  }

  hasCandle() {
    return this.inventory.some(item => item && item.type === 'candle');
  }

  addItem(slot, item) {
    const oldItem = this.inventory[slot];
    this.inventory[slot] = item;
    return oldItem;
  }

  getInventory() {
    return this.inventory;
  }

  drawInventory(ctx, width, height) {
    const slotSize = 40;
    const padding = 10;
    const startX = width - (slotSize + padding) * 5 - padding;
    const startY = height - slotSize - padding;

    // Draw inventory slots
    for (let i = 0; i < 1; i++) {
      const x = startX + (slotSize + padding) * i;
      ctx.fillStyle = '#ddd';
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
  }
}
