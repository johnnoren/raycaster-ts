import { CanvasId } from "./game.js";
import { GameObject, Status } from "./gameObject.js";
import { Vector2 } from "./math/vector2.js";
import { Direction } from "./math/direction.js";
import { BlockType, Map2 } from "./gameObjects/map2.js";

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
        this.direction = this.direction.rotate(-0.052);
    }

    public turnRight(): void {
        this.direction = this.direction.rotate(0.052);
    }

    public moveForward(): void {
        this.move(0.02);
    }

    public moveBackward(): void {
        this.move(-0.02);
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

}

