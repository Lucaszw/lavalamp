export class LavaLamp {
    constructor(options) {
        this.x = options.x || 100;
        this.y = options.y || 100;
        this.width = options.width || 300;
        this.height = options.height || 300;
    }
    calculateSlope1() {
        let x1 = this.x+this.width*(1/4);
        let y1 = this.y;
        let x2 = this.x;
        let y2 = this.y+this.height;
        return (y2-y1)/(x2-x1);
    }
    calculateSlope2() {
        let x1 = this.x+this.width*(3/4);
        let y1 = this.y;
        let x2 = this.x+this.width;
        let y2 = this.y+this.height;
        return (y2-y1)/(x2-x1);
    }
    draw() {
        beginShape();
        vertex(this.x+this.width*(1/4), this.y);
        vertex(this.x+this.width*(3/4), this.y);
        vertex(this.x+this.width, this.y+this.height);
        vertex(this.x, this.y+this.height);
        endShape();
    }
    drawOverlay() {
        fill('rgb(214, 214, 214)');
        beginShape();
        vertex(this.x+this.width*(1/4), this.y);
        vertex(this.x+this.width*(1.5/4), this.y-50);
        vertex(this.x+this.width*(2.5/4), this.y-50);
        vertex(this.x+this.width*(3/4), this.y);
        endShape();

        fill('rgb(176, 176, 176)');
        beginShape();
        vertex(this.x, this.y+this.height);
        vertex(this.x+this.width, this.y+this.height);
        vertex(this.x+this.width*(3.5/4), this.y+this.height+75);
        vertex(this.x+this.width*(0.5/4), this.y+this.height+75);
        endShape();

        fill('rgb(214, 214, 214)');
        beginShape();
        vertex(this.x+this.width*(0.5/4), this.y+this.height+75);
        vertex(this.x+this.width*(3.5/4), this.y+this.height+75);
        // vertex(this.x+this.width*(3/4), this.y+this.height+75);
        vertex(this.x+this.width, this.y+this.height+225);
        vertex(this.x, this.y+this.height+225);
        endShape();
    }
    minX(y) {
        // y = mx + b
        // x = (y - b)/m
        let yFrac = (y-this.y)/(this.height-this.y);
        let max = this.x + this.width*(1/4);
        let min = this.x;
        let minX = max - yFrac*(max-min);
        return minX;
    }
    maxX(y) {
        let yFrac = (y-this.y)/(this.height-this.y);
        let max = this.x + this.width;
        let min = this.x + this.width*(3/4);
        let minX = min + yFrac*(max-min);
        return minX;
    }
    minY(x) {
        return this.y
    }
    maxY(x) {
        return this.y + this.height;
    }
}