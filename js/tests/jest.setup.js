global.Image = class {
    constructor() {
        setTimeout(() => {
            this.onload && this.onload();
        });
    }
};
