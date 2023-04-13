import { GameObject, Status } from "./gameObject";
import { Position } from "./maze2dFactory";

export type Vector2 = { x: number; y: number; }

export class Player implements GameObject {
    constructor(public position: Position, public direction: Vector2, public status: Status) { }

    update(): void {
    }

    render(canvas: HTMLCanvasElement): void {
        const { x, y } = this.position;
        const context = canvas.getContext('2d');
        const radius = 5;

        context!.beginPath();
        context!.arc(x, y, radius, 0, Math.PI * 2);
        context!.fillStyle = 'green';
        context!.fill();
        context!.closePath();
    }
}

