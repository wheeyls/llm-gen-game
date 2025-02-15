class TransitionWorld {
    constructor(width, height, onComplete) {
        this.width = width;
        this.height = height;
        this.onComplete = onComplete;
        this.characters = {};
        this.activeCharacter = null;
        this.backgroundColor = '#FDF6E3'; // Wes Anderson warm background
        
        this.currentDialog = new Dialog(
            "Welcome to the transition sequence.",
            [
                { text: "I seek power", nextDialog: "power" },
                { text: "I seek wisdom", nextDialog: "wisdom" },
                { text: "Let's just explore", nextDialog: "explore" }
            ]
        );

        this.dialogs = {
            power: new Dialog(
                "The path of power is dangerous...",
                [
                    { text: "I understand the risks", nextDialog: "complete" },
                    { text: "Perhaps another path", nextDialog: null }
                ]
            ),
            wisdom: new Dialog(
                "The wise choice is not always clear...",
                [
                    { text: "I will learn", nextDialog: "complete" },
                    { text: "Perhaps another path", nextDialog: null }
                ]
            ),
            explore: new Dialog(
                "The world awaits...",
                [
                    { text: "Let's begin", nextDialog: "complete" },
                    { text: "Perhaps another path", nextDialog: null }
                ]
            ),
            complete: new Dialog(
                "Your journey begins...",
                [
                    { text: "Enter the world", nextDialog: "finish" }
                ]
            )
        };
    }

    update() {
        // Handle any continuous updates if needed
    }

    handleInput(key) {
        const result = this.currentDialog.handleInput(key);
        if (result) {
            if (result.nextDialog === "finish") {
                this.onComplete();
            } else if (result.nextDialog === null) {
                // Go back to first dialog
                this.currentDialog = new Dialog(
                    "Welcome to the transition sequence.",
                    [
                        { text: "I seek power", nextDialog: "power" },
                        { text: "I seek wisdom", nextDialog: "wisdom" },
                        { text: "Let's just explore", nextDialog: "explore" }
                    ]
                );
            } else {
                this.currentDialog = this.dialogs[result.nextDialog];
            }
        }
    }

    draw(ctx) {
        // Clear the canvas with Wes Anderson style background
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw decorative elements (symmetric patterns typical in Wes Anderson)
        this.drawDecorations(ctx);
        
        // Draw all characters
        Object.values(this.characters).forEach(char => char.draw(ctx));
        
        // Draw the current dialog centered
        this.currentDialog.draw(ctx, 
            (this.width - 500) / 2,
            (this.height - 150) / 2
        );
    }

    drawDecorations(ctx) {
        // Add symmetric decorative patterns
        ctx.strokeStyle = '#E9B872';
        ctx.lineWidth = 2;
        
        // Draw border
        const margin = 30;
        ctx.strokeRect(margin, margin, this.width - margin*2, this.height - margin*2);
        
        // Draw corner decorations
        const cornerSize = 50;
        this.drawCornerDecoration(ctx, margin, margin, cornerSize);
        this.drawCornerDecoration(ctx, this.width - margin, margin, cornerSize);
        this.drawCornerDecoration(ctx, margin, this.height - margin, cornerSize);
        this.drawCornerDecoration(ctx, this.width - margin, this.height - margin, cornerSize);
    }

    drawCornerDecoration(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.moveTo(-size/2, 0);
        ctx.lineTo(0, -size/2);
        ctx.stroke();
        ctx.restore();
    }
}
