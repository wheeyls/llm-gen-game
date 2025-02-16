import Sprite from './sprite.js';

export default class Wall extends Sprite {
    constructor(x, y, width, height) {
        super(x, y, width, height, '#333');
    }
}
