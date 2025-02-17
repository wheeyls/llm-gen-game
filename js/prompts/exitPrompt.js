import BasePrompt from './basePrompt.js';

export default class ExitPrompt extends BasePrompt {
  constructor(inventory) {
    super();
    this.inventory = inventory;
    this.title = 'Exit Found!';

    // Set inventory status
    let filledSlots = inventory.filter(item => item).length;
    this.subtitle = `Current inventory: ${filledSlots}/5 slots filled`;

    this.options = [
      { text: 'Exit with current items', action: 'exit' },
      { text: 'Continue exploring', action: 'continue' },
    ];
  }

  draw(ctx, x, y) {
    super.draw(ctx, x, y);
  }
}
