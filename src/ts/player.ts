import { GameObject, Status } from "./gameObject";
import { Position } from "./maze2dFactory";

export type Vector2 = { x: number; y: number; }

type Matrix2 = [[number, number], [number, number]];

export class Player implements GameObject {
    constructor(public position: Position, public direction: Vector2, public status: Status) { }

    public update(): void {
    }

    public render(canvas: HTMLCanvasElement): void {
        const { x, y } = this.position;
        const context = canvas.getContext('2d');
        const radius = 5;

        context!.beginPath();
        context!.arc(x, y, radius, 0, Math.PI * 2);
        context!.fillStyle = 'green';
        context!.fill();
        context!.closePath();
    }

    public turnLeft(): void {
        this.turn(-1);
    }

    public turnRight(): void {
        this.turn(1);
    }

    public moveForward(): void {
        this.move(1);
    }

    public moveBackward(): void {
        this.move(-1);
    }

    public turn(angle: number): void {
        const radians = angle * Math.PI / 180;
        const cosAngle = Math.cos(radians);
        const sinAngle = Math.sin(radians);
        const sign = angle > 0 ? 1 : -1;
        const rotationMatrix: Matrix2 = [
            [cosAngle, -sign * sinAngle],
            [sign * sinAngle, cosAngle]
        ];
        const newDirection: Vector2 = this.multiplyMatrixAndVector(rotationMatrix, this.direction);
        this.direction = newDirection;
    }

    private move(distance: number): void {
        const newPosition: Position = {
            x: this.position.x + distance * this.direction.x,
            y: this.position.y + distance * this.direction.y
        };
        this.position = newPosition;
    }

    private multiplyMatrixAndVector(matrix: Matrix2, vector: Vector2): Vector2 {
        const x = matrix[0][0] * vector.x + matrix[0][1] * vector.y;
        const y = matrix[1][0] * vector.x + matrix[1][1] * vector.y;
        return { x, y };
    }
}

