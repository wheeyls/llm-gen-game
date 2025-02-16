export default class BasePrompt {
    constructor() {
        this.visible = true;
    }

    draw(ctx, x, y, width, height) {
        if (!this.visible) return;

        // Draw prompt box
        ctx.fillStyle = '#f0f0f0';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    }

    handleInput(key) {
        if (!this.visible) return null;
        return null;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }
}
