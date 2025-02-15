class TransitionWorld {
    constructor(width, height, onComplete) {
        this.width = width;
        this.height = height;
        this.onComplete = onComplete;
        
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
        // Clear the canvas
        ctx.fillStyle = '#2c3e50';  // Wes Anderson inspired background color
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw the current dialog centered
        this.currentDialog.draw(ctx, 
            (this.width - 500) / 2,
            (this.height - 150) / 2
        );
    }
}
