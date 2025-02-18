import BasePrompt from './basePrompt.js';

export default class ItemPrompt extends BasePrompt {
  constructor(item) {
    super();
    this.item = item;
    this.title = `Found: ${this.item.type}`;
    this.subtitle = null;
    this.options = [{
      text: 'Take Item',
      action: 'slot0',
    }];
  }

  handleInput(input) {
    // Handle number key shortcut (1)
    const number = input.oneOf('1');
    if (number) {
      const slot = 0;
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
