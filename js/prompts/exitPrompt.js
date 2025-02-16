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
            { text: "Exit with current items", action: 'exit' },
            { text: "Continue exploring", action: 'continue' }
        ];
    }

    draw(ctx, x, y) {
        super.draw(ctx, x, y, 300, 200);

        // Draw subtitle (inventory status)
        if (this.subtitle) {
            ctx.fillStyle = '#333';
            ctx.font = '16px Arial';
            ctx.fillText(this.subtitle, x + 20, y + 60);
        }
    }
}
