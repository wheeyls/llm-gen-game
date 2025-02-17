import BasePrompt from './basePrompt.js';

export default class ItemPrompt extends BasePrompt {
  constructor(item) {
    super();
    this.item = item;
    this.title = `Found: ${this.item.type}`;
    this.subtitle = null;
    this.options = Array.from({ length: 5 }, (_, i) => ({
      text: `Slot ${i + 1}`,
      action: `slot${i}`,
    }));
  }

  handleInput(key) {
    // Handle number key shortcuts (1-5)
    if (key >= '1' && key <= '5') {
      const slot = parseInt(key) - 1;
      this.selectedIndex = slot;
      this.hide();
      return { action: 'confirm', value: slot };
    }

    const result = super.handleInput(key);
    if (!result) return null;

    // Transform base actions into slot-specific actions
    if (result.action.startsWith('slot')) {
      const slot = parseInt(result.action.slice(4));
      return { action: 'confirm', value: slot };
    }

    return result;
  }
}
