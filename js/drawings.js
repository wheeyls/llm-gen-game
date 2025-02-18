export const DayOfTheDeadDrawings = {
  // Color palette
  colors: {
    pink: '#FF69B4',      // Papel picado
    orange: '#FF9636',    // Marigolds
    purple: '#42033D',    // Deep accents
    white: '#FFFFFF',     // Sugar skulls
    altarPink: '#f72585'  // Ofrenda
  },

  papelPicado(ctx, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    // Draw a decorative banner shape
    ctx.moveTo(-size/2, -size/4);
    ctx.lineTo(size/2, -size/4);
    ctx.lineTo(size/2, size/4);
    ctx.lineTo(0, size/2);
    ctx.lineTo(-size/2, size/4);
    ctx.closePath();
    ctx.fill();
    // Add decorative holes
    ctx.fillStyle = this.colors.purple;
    ctx.beginPath();
    ctx.arc(0, 0, size/8, 0, Math.PI * 2);
    ctx.fill();
  },

  marigold(ctx, size, color) {
    // Draw marigold flower
    ctx.fillStyle = color;
    for (let i = 0; i < 12; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 12);
      ctx.beginPath();
      ctx.ellipse(size/2, 0, size/4, size/8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Draw center
    ctx.fillStyle = this.colors.purple;
    ctx.beginPath();
    ctx.arc(0, 0, size/6, 0, Math.PI * 2);
    ctx.fill();
  },

  sugarSkull(ctx, size) {
    // Base skull shape
    ctx.fillStyle = this.colors.white;
    ctx.beginPath();
    ctx.arc(0, 0, size/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Decorative patterns
    ctx.strokeStyle = this.colors.purple;
    ctx.lineWidth = 2;
    // Eyes
    ctx.beginPath();
    ctx.arc(-size/4, -size/8, size/8, 0, Math.PI * 2);
    ctx.arc(size/4, -size/8, size/8, 0, Math.PI * 2);
    ctx.stroke();
    // Nose
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size/8, size/8);
    ctx.lineTo(size/8, size/8);
    ctx.closePath();
    ctx.stroke();
    // Decorative swirls
    ctx.beginPath();
    ctx.arc(-size/3, size/4, size/8, 0, Math.PI);
    ctx.arc(size/3, size/4, size/8, 0, Math.PI);
    ctx.stroke();
  }
};
