export class Vector2 {
    constructor(x, y, magnitude) {
        this.x = x;
        this.y = y;
        this.magnitudeValue = magnitude !== null && magnitude !== void 0 ? magnitude : undefined;
    }
    get magnitude() {
        if (this.magnitudeValue === undefined) {
            this.magnitudeValue = Math.sqrt(this.x * this.x + this.y * this.y);
        }
        return this.magnitudeValue;
    }
    normalized() {
        const magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        const normX = this.x / magnitude;
        const normY = this.y / magnitude;
        return new Vector2(normX, normY);
    }
    floored() {
        const x = Math.floor(this.x);
        const y = Math.floor(this.y);
        const magnitude = this.magnitudeValue;
        return new Vector2(x, y, magnitude);
    }
    subtract(other) {
        const x = this.x - other.x;
        const y = this.y - other.y;
        const magnitude = this.magnitudeValue;
        return new Vector2(x, y, magnitude);
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    static from(magnitude, direction) {
        const x = magnitude * direction.x;
        const y = magnitude * direction.y;
        return new Vector2(x, y, magnitude);
    }
    rotate(radians) {
        const cosAngle = Math.cos(radians);
        const sinAngle = Math.sin(radians);
        const rotationMatrix = [
            [cosAngle, -sinAngle],
            [sinAngle, cosAngle]
        ];
        return this.multiplyMatrixAndVector(rotationMatrix, this);
    }
    multiplyMatrixAndVector(matrix, vector) {
        const x = matrix[0][0] * vector.x + matrix[0][1] * vector.y;
        const y = matrix[1][0] * vector.x + matrix[1][1] * vector.y;
        return new Vector2(x, y);
    }
}
