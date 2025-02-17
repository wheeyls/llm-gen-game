import Dialog from './dialog.js';
import ParallaxTransition from './parallaxTransition.js';

export default class TransitionWorld {
  constructor(width, height, onComplete, game) {
    this.width = width;
    this.height = height;
    this.onComplete = onComplete;
    this.game = game;
    this.characters = {};
    this.activeCharacter = null;
    this.backgroundColor = '#FDF6E3'; // Wes Anderson warm background
    this.parallax = new ParallaxTransition(width, height);

    this.currentDialog = new Dialog('Welcome to the transition sequence.', [
      { text: 'I seek power', nextDialog: 'power' },
      { text: 'I seek wisdom', nextDialog: 'wisdom' },
      { text: "Let's just explore", nextDialog: 'explore' },
    ]);

    this.dialogs = {
      power: new Dialog('The path of power is dangerous...', [
        { text: 'I understand the risks', nextDialog: 'complete' },
        { text: 'Perhaps another path', nextDialog: null },
      ]),
      wisdom: new Dialog('The wise choice is not always clear...', [
        { text: 'I will learn', nextDialog: 'complete' },
        { text: 'Perhaps another path', nextDialog: null },
      ]),
      explore: new Dialog('The world awaits...', [
        { text: "Let's begin", nextDialog: 'complete' },
        { text: 'Perhaps another path', nextDialog: null },
      ]),
      complete: new Dialog('Your journey begins...', [
        { text: 'Enter the world', nextDialog: 'finish' },
      ]),
    };
  }

  update(deltaTime) {
    // Update parallax transition
    if (this.parallax.update(deltaTime)) {
      // Transition complete, update dialog
      this.nextDialogState.complete();
    }
  }

  update(deltaTime) {
    // Update parallax transition
    if (this.parallax.update(deltaTime)) {
      // Transition complete, update dialog
      this.nextDialogState?.complete();
    }

    // Handle input
    if (this.game.input.isPressed('Escape')) {
      this.onComplete();
      return;
    }

    if (this.parallax.isTransitioning) return;

    // Convert pressed keys to input events
    if (this.game.input.isPressed('ArrowUp') || this.game.input.isPressed('w')) {
      this.currentDialog.handleInput('ArrowUp');
    }
    if (this.game.input.isPressed('ArrowDown') || this.game.input.isPressed('s')) {
      this.currentDialog.handleInput('ArrowDown');
    }
    if (this.game.input.isPressed('Enter')) {
      const result = this.currentDialog.handleInput('Enter');
    if (result) {
      const goingBack = result.nextDialog === null;
      this.parallax.startTransition(!goingBack);

      // Store next dialog state
      this.nextDialogState = {
        result: result,
        complete: () => {
          if (result.nextDialog === 'finish') {
            this.onComplete();
          } else if (result.nextDialog === null) {
            // Go back to first dialog
            this.currentDialog = new Dialog('Welcome to the transition sequence.', [
              { text: 'I seek power', nextDialog: 'power' },
              { text: 'I seek wisdom', nextDialog: 'wisdom' },
              { text: "Let's just explore", nextDialog: 'explore' },
            ]);
          } else {
            this.currentDialog = this.dialogs[result.nextDialog];
          }
        },
      };
    }
  }

  draw(ctx) {
    // Clear the canvas with Wes Anderson style background
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw parallax elements
    this.parallax.draw(ctx);

    // Draw decorative elements
    this.drawDecorations(ctx);

    // Draw all characters
    Object.values(this.characters).forEach(char => char.draw(ctx));

    // Draw the current dialog centered
    this.currentDialog.draw(ctx, (this.width - 500) / 2, (this.height - 150) / 2);
  }

  drawDecorations(ctx) {
    // Add symmetric decorative patterns
    ctx.strokeStyle = '#E9B872';
    ctx.lineWidth = 2;

    // Draw border
    ctx.strokeRect(0, 0, this.width, this.height);

    // Draw corner decorations
    const cornerSize = 80;
    this.drawCornerDecoration(ctx, 0, 0, cornerSize, 1, 1);
    this.drawCornerDecoration(ctx, this.width, 0, cornerSize, -1, 1);
    this.drawCornerDecoration(ctx, 0, this.height, cornerSize, 1, -1);
    this.drawCornerDecoration(ctx, this.width, this.height, cornerSize, -1, -1);
  }

  drawCornerDecoration(ctx, x, y, size, dirX, dirY) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size * dirX, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, size * dirY);
    ctx.stroke();
    ctx.restore();
  }
}
