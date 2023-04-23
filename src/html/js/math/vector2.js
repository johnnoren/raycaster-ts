export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalized() {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        const normX = this.x / length;
        const normY = this.y / length;
        return new Vector2(normX, normY);
    }
    static from(magnitude, direction) {
        const x = magnitude * direction.x;
        const y = magnitude * direction.y;
        return new Vector2(x, y);
    }
}
