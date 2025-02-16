import BasePrompt from './basePrompt.js';

export default class ExitPrompt extends BasePrompt {
    constructor(inventory) {
        super();
        this.inventory = inventory;
        this.selectedOption = 0;
        this.options = [
            { text: "Exit with current items", action: 'exit' },
            { text: "Continue exploring", action: 'continue' }
        ];
    }

    draw(ctx, x, y) {
        super.draw(ctx, x, y, 300, 200);

        // Draw prompt info
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.fillText('Exit Found!', x + 20, y + 30);
        ctx.fillText('Current inventory:', x + 20, y + 60);

        // Draw inventory summary
        let filledSlots = this.inventory.filter(item => item).length;
        ctx.fillText(`${filledSlots}/5 slots filled`, x + 20, y + 90);

        // Draw options
        this.options.forEach((option, i) => {
            ctx.fillStyle = i === this.selectedOption ? '#0066cc' : '#333';
            ctx.fillText(`> ${option.text}`, x + 30, y + 130 + (i * 25));
        });
    }

    handleInput(key) {
        if (!this.visible) return null;

        if (key === 'ArrowUp' || key === 'w' || key === 'W') {
            this.selectedOption = Math.max(0, this.selectedOption - 1);
        }
        if (key === 'ArrowDown' || key === 's' || key === 'S') {
            this.selectedOption = Math.min(this.options.length - 1, this.selectedOption + 1);
        }
        if (key === 'Enter') {
            this.hide();
            return { action: this.options[this.selectedOption].action };
        }
        if (key === 'Escape') {
            this.hide();
            return { action: 'continue' };
        }
        return null;
    }
}
