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

  handleInput(input) {
    // Handle number key shortcuts (1-5)
    const number = input.oneOf('1', '2', '3', '4', '5');
    if (number) {
      const slot = parseInt(number) - 1;
      this.selectedIndex = slot;
      this.hide();
      return { action: 'confirm', value: slot };
    }

    const result = super.handleInput(input);
    if (!result) return null;

    // Transform base actions into slot-specific actions
    if (result.action.startsWith('slot')) {
      const slot = parseInt(result.action.slice(4));
      return { action: 'confirm', value: slot };
    }

    return result;
  }
}
