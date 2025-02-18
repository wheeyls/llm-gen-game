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
  },

  portal(ctx, size) {
    // Spiral portal effect
    const spiralSteps = 12;
    ctx.strokeStyle = this.colors.purple;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < spiralSteps; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / spiralSteps);
      const scale = 1 - (i / spiralSteps) * 0.5;
      
      // Draw portal arch
      ctx.beginPath();
      ctx.arc(0, 0, size/2 * scale, 0, Math.PI, true);
      ctx.stroke();
      
      // Add floating calaveras
      if (i % 3 === 0) {
        ctx.save();
        ctx.translate(0, -size/3 * scale);
        ctx.scale(0.3, 0.3);
        this.sugarSkull(ctx, size);
        ctx.restore();
      }
      
      ctx.restore();
    }
    
    // Add marigold petals around the portal
    for (let i = 0; i < 8; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 8);
      ctx.translate(size/2, 0);
      ctx.scale(0.3, 0.3);
      this.marigold(ctx, size, this.colors.orange);
      ctx.restore();
    }
  },

  ofrenda(ctx, size) {
    // Draw altar table
    ctx.fillStyle = '#8B4513'; // Wood color
    ctx.fillRect(-size/2, -size/4, size, size/2);
    
    // Draw cloth
    ctx.fillStyle = this.colors.pink;
    ctx.beginPath();
    ctx.moveTo(-size/2, -size/4);
    ctx.lineTo(size/2, -size/4);
    ctx.lineTo(size/2 + size/4, 0);
    ctx.lineTo(-size/2 - size/4, 0);
    ctx.closePath();
    ctx.fill();
    
    // Draw candles
    const candlePositions = [-size/3, 0, size/3];
    candlePositions.forEach(x => {
      // Candle base
      ctx.fillStyle = this.colors.white;
      ctx.fillRect(x - size/16, -size/2, size/8, size/4);
      
      // Flame
      ctx.fillStyle = this.colors.orange;
      ctx.beginPath();
      ctx.ellipse(x, -size/2, size/16, size/8, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw central photo frame
    ctx.strokeStyle = this.colors.purple;
    ctx.lineWidth = 3;
    ctx.strokeRect(-size/4, -size/2, size/2, size/2);
    
    // Draw marigolds at the base
    [-size/3, size/3].forEach(x => {
      ctx.save();
      ctx.translate(x, 0);
      ctx.scale(0.4, 0.4);
      this.marigold(ctx, size, this.colors.orange);
      ctx.restore();
    });
  }
};
