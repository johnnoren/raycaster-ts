import { CanvasId } from "./game.js";
import { GameObject, Status } from "./gameObject.js";
import { BlockType, Maze2d } from "./maze2dFactory.js";
import { Player, Vector2 } from "./player.js";

export class Ray implements GameObject {
    private distanceToWall: number = 0;
    private wallScaleFactor: number = 8;

    constructor(private player: Player, public status: Status, private map: Maze2d, private angle: number, private rayNumber: number, private numberOfRays: number) { }

    update(): void { }

    render(canvases: HTMLCanvasElement[]): void {
        canvases.forEach((canvas) => {
            switch (canvas.id) {
                case CanvasId.map:
                    this.renderMap(canvas);
                    break;
                case CanvasId.fov:
                    this.renderFov(canvas);
                    break;
                default: throw new Error("CanvasId not implemented: " + canvas.id);
            }
        });
    }

    private renderMap(mapCanvas: HTMLCanvasElement): void {
        const mapCanvasContext = mapCanvas.getContext('2d');
        const { x: startX, y: startY } = this.player.position;
        const { x: dirX, y: dirY } = this.player.direction;
        const { dirXOffset, dirYOffset } = this.getOffsetAdjustedDirection(dirX, dirY);

        this.distanceToWall = this.getDistanceToWall(startX, startY, dirXOffset, dirYOffset, mapCanvas);

        this.drawRayOnMap(mapCanvasContext!, startX, startY, dirXOffset, dirYOffset, this.distanceToWall);
    }

    private renderFov(fovCanvas: HTMLCanvasElement): void {
        const fovCanvasContext = fovCanvas.getContext('2d');
        const distanceToWall = this.distanceToWall;
        const distanceToWallAdjusted = distanceToWall * Math.cos(this.angle);
        const wallHeight = (fovCanvas.height / distanceToWallAdjusted) * this.wallScaleFactor;
        const wallColumnWidth = fovCanvas.width / this.numberOfRays;
        const wallColumnX = this.rayNumber * wallColumnWidth;
    
        fovCanvasContext!.fillStyle = "rgba(255, 0, 0, 0.5)";
        fovCanvasContext!.fillRect(wallColumnX, fovCanvas.height / 2 - wallHeight / 2, wallColumnWidth, wallHeight);
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
