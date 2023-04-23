export class Vector2 {
    constructor(x, y, magnitude) {
        this.x = x;
        this.y = y;
        this.magnitude = magnitude || Math.sqrt(x * x + y * y);
    }
    normalized() {
        const magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        const normX = this.x / magnitude;
        const normY = this.y / magnitude;
        return new Vector2(normX, normY);
    }
    static from(magnitude, direction) {
        const x = magnitude * direction.x;
        const y = magnitude * direction.y;
        return new Vector2(x, y, magnitude);
    }
}
