// Mock canvas and context
class CanvasRenderingContext2D {
    fillStyle = '#000000';
    strokeStyle = '#000000';
    lineWidth = 1;
    font = '10px sans-serif';
    globalAlpha = 1;

    fillRect() {}
    strokeRect() {}
    fillText() {}
    clearRect() {}
    beginPath() {}
    moveTo() {}
    lineTo() {}
    stroke() {}
    save() {}
    restore() {}
    translate() {}
    scale() {}
    drawImage() {}
}

class HTMLCanvasElement {
    getContext() {
        return new CanvasRenderingContext2D();
    }
}

// Add to global
global.HTMLCanvasElement = HTMLCanvasElement;
global.Image = class {
    constructor() {
        setTimeout(() => {
            this.onload && this.onload();
        });
    }
};
