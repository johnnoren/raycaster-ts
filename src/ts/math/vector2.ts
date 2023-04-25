import { Direction } from "./direction.js";

export class Vector2 {
    public readonly x: number;
    public readonly y: number;
    private magnitudeValue?: number;

    constructor(x: number, y: number, magnitude?: number) {
        this.x = x;
        this.y = y;
        this.magnitudeValue = magnitude ?? undefined;
    }

    get magnitude(): number {
        if (this.magnitudeValue === undefined) {
            this.magnitudeValue = Math.sqrt(this.x * this.x + this.y * this.y);
        }
        return this.magnitudeValue;
    }

    public normalized(): Vector2 {
        const magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        const normX = this.x / magnitude;
        const normY = this.y / magnitude;

        return new Vector2(normX, normY);
    }

    public floored(): Vector2 {
        const x = Math.floor(this.x);
        const y = Math.floor(this.y);
        const magnitude = this.magnitudeValue;

        return new Vector2(x, y, magnitude);
    }

    public subtract(other: Vector2): Vector2 {
        const x = this.x - other.x;
        const y = this.y - other.y;
        const magnitude = this.magnitudeValue;

        return new Vector2(x, y, magnitude);
    }

    public equals(other: Vector2): boolean {
        return this.x === other.x && this.y === other.y;
    }

    static from(magnitude: number, direction: Direction): Vector2 {
        const x = magnitude * direction.x;
        const y = magnitude * direction.y;

        return new Vector2(x, y, magnitude);
    }

}