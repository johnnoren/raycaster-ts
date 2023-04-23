import { Direction } from "./direction.js";

export class Vector2 {
    public readonly x: number;
    public readonly y: number;
    public readonly magnitude: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public normalized(): Vector2 {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        const normX = this.x / length;
        const normY = this.y / length;

        return new Vector2(normX, normY);
    }

    static from(magnitude: number, direction: Direction): Vector2 {
        const x = magnitude * direction.x;
        const y = magnitude * direction.y;

        return new Vector2(x, y);
    }

}