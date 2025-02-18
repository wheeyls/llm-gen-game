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

    this.currentDialog = new Dialog('¡Bienvenido al mundo de los espíritus!', [
      { text: 'Quiero guiar a las almas', nextDialog: 'guide' },
      { text: 'Busco el camino a la ofrenda', nextDialog: 'ofrenda' },
      { text: 'Necesito encontrar velas', nextDialog: 'candles' },
    ]);

    this.dialogs = {
      guide: new Dialog('Las almas perdidas necesitan tu ayuda...', [
        { text: 'Seré su guía', nextDialog: 'complete' },
        { text: 'Quizás otro camino', nextDialog: null },
      ]),
      ofrenda: new Dialog('La ofrenda es donde las almas encontrarán paz...', [
        { text: 'Las llevaré allí', nextDialog: 'complete' },
        { text: 'Quizás otro camino', nextDialog: null },
      ]),
      candles: new Dialog('Las velas alejan la oscuridad y calman a las almas...', [
        { text: 'Entiendo su importancia', nextDialog: 'complete' },
        { text: 'Quizás otro camino', nextDialog: null },
      ]),
      complete: new Dialog('Tu misión es clara: guía las almas a la ofrenda, usa las velas para protegerlas de la oscuridad...', [
        { text: 'Comenzar mi misión', nextDialog: 'finish' },
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
    const input = this.game.input;

    if (input.isEscape) {
      this.onComplete();
      return;
    }

    if (this.parallax.isTransitioning) return;

    let result = null;
    // Convert pressed keys to input events
    if (input.justUp) {
      console.log('ArrowUp');
      result = this.currentDialog.handleInput('ArrowUp');
    }
    if (input.justDown) {
      console.log('ArrowDown');
      result = this.currentDialog.handleInput('ArrowDown');
    }

    result = this.currentDialog.handleInput(input);

    if (input.justEnter) {
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
              this.currentDialog = new Dialog('¡Bienvenido al mundo de los espíritus!', [
                { text: 'Quiero guiar a las almas', nextDialog: 'guide' },
                { text: 'Busco el camino a la ofrenda', nextDialog: 'ofrenda' },
                { text: 'Necesito encontrar velas', nextDialog: 'candles' },
              ]);
            } else {
              this.currentDialog = this.dialogs[result.nextDialog];
            }
          },
        };
      }
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
