class ItemPrompt {
    constructor(item) {
        this.item = item;
        this.selectedSlot = 0;
        this.visible = true;
    }

    draw(ctx, x, y) {
        if (!this.visible) return;

        // Draw prompt box
        ctx.fillStyle = '#f0f0f0';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.fillRect(x, y, 300, 180);
        ctx.strokeRect(x, y, 300, 180);

        // Draw item info
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.fillText(`Found: ${this.item.type}`, x + 20, y + 30);
        ctx.fillText('Use ↑↓ to select slot, Enter to confirm, Esc to cancel', x + 20, y + 60);

        // Draw slot options
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = i === this.selectedSlot ? '#0066cc' : '#333';
            ctx.fillText(`Slot ${i + 1}`, x + 30, y + 90 + (i * 20));
        }
    }

    handleInput(key) {
        if (!this.visible) return null;

        if (key === 'ArrowUp') {
            this.selectedSlot = Math.max(0, this.selectedSlot - 1);
            return { action: 'select', slot: this.selectedSlot };
        }
        if (key === 'ArrowDown') {
            this.selectedSlot = Math.min(4, this.selectedSlot + 1);
            return { action: 'select', slot: this.selectedSlot };
        }
        // Number key shortcuts (1-5)
        if (key >= '1' && key <= '5') {
            const slot = parseInt(key) - 1;
            this.selectedSlot = slot;
            this.visible = false;
            return { action: 'confirm', slot: slot };
        }
        if (key === 'Enter') {
            this.visible = false;
            return { action: 'confirm', slot: this.selectedSlot };
        }
        if (key === 'Escape') {
            this.visible = false;
            return { action: 'cancel' };
        }
        return null;
    }
}
