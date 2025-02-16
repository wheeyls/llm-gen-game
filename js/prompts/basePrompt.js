export default class BasePrompt {
    constructor() {
        this.visible = true;
        this.selectedIndex = 0;
        this.options = [];
    }

    draw(ctx, x, y, width, height) {
        if (!this.visible) return;

        // Draw prompt box
        ctx.fillStyle = '#f0f0f0';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);

        // Draw title if exists
        if (this.title) {
            ctx.fillStyle = '#333';
            ctx.font = '16px Arial';
            ctx.fillText(this.title, x + 20, y + 30);
        }

        // Draw options
        this.options.forEach((option, i) => {
            ctx.fillStyle = i === this.selectedIndex ? '#0066cc' : '#333';
            ctx.fillText(`> ${option.text}`, x + 30, y + 90 + (i * 25));
        });
    }

    handleInput(key) {
        if (!this.visible) return null;

        if (key === 'ArrowUp' || key === 'w' || key === 'W') {
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            return { action: 'select' };
        }
        if (key === 'ArrowDown' || key === 's' || key === 'S') {
            this.selectedIndex = Math.min(this.options.length - 1, this.selectedIndex + 1);
            return { action: 'select' };
        }
        if (key === 'Enter') {
            this.hide();
            return { action: this.options[this.selectedIndex].action };
        }
        if (key === 'Escape') {
            this.hide();
            return { action: 'cancel' };
        }
        return null;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }
}
