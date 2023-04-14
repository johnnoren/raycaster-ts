import { GameCanvas, GameCanvasId } from "./gameCanvas.js";
import { GameObject, Status } from "./gameObject.js";
import { BlockType, Maze2d } from "./maze2dFactory.js";
import { Player, Vector2 } from "./player.js";

export class Ray implements GameObject {
    constructor(private player: Player, public status: Status, private map: Maze2d, private angle: number) { }

    update(): void { }

    render(gameCanvases: GameCanvas[]): void {
        gameCanvases.forEach((gameCanvas) => {
            switch (gameCanvas.id) {
                case GameCanvasId.map:
                    this.renderMap(gameCanvas.canvas);
                    break;
                case GameCanvasId.fov:
                    this.renderFov(gameCanvas.canvas);
                    break;
                default: throw new Error("CanvasId not implemented: " + gameCanvas.id);
            }
        });
    }

    private renderMap(mapCanvas: HTMLCanvasElement): void {
        const mapCanvasContext = mapCanvas.getContext('2d');
        const { x: startX, y: startY } = this.player.position;
        const { x: dirX, y: dirY } = this.player.direction;
        const { dirXOffset, dirYOffset } = this.getOffsetAdjustedDirection(dirX, dirY);

        const distanceToWall = this.getDistanceToWall(startX, startY, dirXOffset, dirYOffset, mapCanvas);

        this.drawRayOnMap(mapCanvasContext!, startX, startY, dirXOffset, dirYOffset, distanceToWall);
    }

    private renderFov(fovCanvas: HTMLCanvasElement): void {
        // TODO: Implement
    }

    private getOffsetAdjustedDirection(dirX: number, dirY: number) {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        const dirXOffset = dirX * cos - dirY * sin;
        const dirYOffset = dirX * sin + dirY * cos;
        return { dirXOffset, dirYOffset };
    }

    private drawRayOnMap(context: CanvasRenderingContext2D, startX: number, startY: number, dirX: number, dirY: number, distance: number): void {
        context!.beginPath();
        context!.moveTo(startX, startY);
        context!.lineTo(startX + dirX * distance, startY + dirY * distance);
        context!.strokeStyle = "red";
        context!.stroke();
    }

    private getDistanceToWall(startX: number, startY: number, dirX: number, dirY: number, canvas: HTMLCanvasElement): number {
        let distance = 0;
        let hitWall = false;
        while (!hitWall && distance < canvas.width) {
            const x = startX + dirX * distance;
            const y = startY + dirY * distance;
            if (this.map.isBlockType({ x, y }, BlockType.Wall)) {
                hitWall = true;
            } else {
                distance++;
            }
        }
        return distance;
    }
}
