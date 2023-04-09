export class Position2d {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public equals(other: Position2d): boolean {
        return this.x === other.x && this.y === other.y;
    }

}