import { CanvasId } from "./game.js";
import { GameObject, Status } from "./gameObject.js";
import { Vector2 } from "./math/vector2.js";
import { Direction } from "./math/direction.js";
import { BlockType, Map2 } from "./gameObjects/map2.js";

type Matrix2 = [[number, number], [number, number]];

export class Player implements GameObject {
    constructor(public position: Vector2, public direction: Direction, public status: Status, private map: Map2) { }

    public update(): void {
    }

    render(canvases: HTMLCanvasElement[], blockSize: number): void {
        canvases.forEach((canvas) => {
            switch (canvas.id) {
                case CanvasId.map:
                    this.renderMap(canvas, blockSize);
                    break;
                case CanvasId.fov:
                    
                    break;
                default: throw new Error("CanvasId not implemented: " + canvas.id);
            }
        });
    }

    private renderMap(canvas: HTMLCanvasElement, blockSize: number): void {
        const x = this.position.x * blockSize;
        const y = this.position.y * blockSize;
        const context = canvas.getContext('2d');
        const radius = 3;

        context!.beginPath();
        context!.arc(x, y, radius, 0, Math.PI * 2);
        context!.fillStyle = 'lime';
        context!.fill();
        context!.closePath();
    }

    public turnLeft(): void {
        this.turn(-3);
    }

    public turnRight(): void {
        this.turn(3);
    }

    public moveForward(): void {
        this.move(0.02);
    }

    public moveBackward(): void {
        this.move(-0.02);
    }

    public turn(angle: number): void { // Move these things into vector2 and direction, call it rotate.
        const radians = angle * Math.PI / 180;
        const cosAngle = Math.cos(radians);
        const sinAngle = Math.sin(radians);
        const rotationMatrix: Matrix2 = [
            [cosAngle, -sinAngle],
            [sinAngle, cosAngle]
        ];
        this.direction = new Direction(this.multiplyMatrixAndVector(rotationMatrix, this.direction.vector));
        
    }
    
    private move(distance: number): void {
        const newPosition: Vector2 = new Vector2(
            this.position.x + distance * this.direction.x,
            this.position.y + distance * this.direction.y
        );

        if (!this.map.isBlockType(newPosition, BlockType.Wall)) {
            this.position = newPosition;
        }
    }

    private multiplyMatrixAndVector(matrix: Matrix2, vector: Vector2): Vector2 {
        const x = matrix[0][0] * vector.x + matrix[0][1] * vector.y;
        const y = matrix[1][0] * vector.x + matrix[1][1] * vector.y;
        return new Vector2(x, y);
    }
}

