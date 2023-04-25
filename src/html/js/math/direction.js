export class Direction {
    get x() {
        return this.vector.x;
    }
    get y() {
        return this.vector.y;
    }
    constructor(vector) {
        this.vector = vector.normalized();
    }
}