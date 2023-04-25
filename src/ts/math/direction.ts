import { Vector2 } from './vector2.js';

export class Direction {
    public readonly vector: Vector2;

    public get x(): number {
        return this.vector.x;
    }
    public get y(): number {
        return this.vector.y;
    }

    constructor(vector: Vector2) {
        this.vector = vector.normalized();
    }

    public rotate(radians: number): Direction {
        return new Direction(this.vector.rotate(radians));
    }
    
}