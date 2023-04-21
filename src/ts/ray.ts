import { Dda } from "./dda.js";
import { CanvasId } from "./game.js";
import { GameObject, Status } from "./gameObject.js";
import { BlockType, Maze2d, Position } from "./maze2dFactory.js";
import { Player, Vector2 } from "./player.js";

export class Ray implements GameObject {
    private distanceToWall: number = 0;
    private cellPosition: Vector2 = { x: 0, y: 0 };

    constructor(private player: Player, public status: Status, private map: Maze2d, private angle: number, private rayNumber: number, private numberOfRays: number, private color: string, private distanceToProjectionPlane: number, private blockSize: number, private dda: Dda) { }

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
        const direction = this.getOffsetAdjustedDirection(this.player.direction);
    
        this.distanceToWall = this.getDistanceToWall(direction, mapCanvasContext!);
    
        this.drawRayOnMap(mapCanvasContext!, this.player.position, direction, this.distanceToWall);
    }
    
    private renderFov(fovCanvas: HTMLCanvasElement): void {
        const fovCanvasContext = fovCanvas.getContext('2d');
        const scalingFactor = 1; // Adjust this value to increase or decrease the wall width
        const wallHeightScalingFactor = 0.05; // Adjust this value to increase or decrease the wall height
    
        if (this.map.isBlockType(this.cellPosition, BlockType.Wall)) {
            const fishEyeCorrectedDistance = this.distanceToWall * Math.cos(this.angle);
            const wallHeight = ((this.blockSize * this.distanceToProjectionPlane) / fishEyeCorrectedDistance) * wallHeightScalingFactor;
            const wallColumnWidth = (fovCanvas.width / this.numberOfRays) * scalingFactor;
            const wallColumnX = this.rayNumber * wallColumnWidth;
    
            fovCanvasContext!.fillStyle = "rgba(255, 0, 0, 0.5)";
            fovCanvasContext!.fillRect(wallColumnX, fovCanvas.height / 2 - wallHeight / 2, wallColumnWidth, wallHeight);
        }
    }
    
    private getOffsetAdjustedDirection(direction: Vector2): Vector2 {
        const { x: dirX, y: dirY } = direction;
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        const dirXOffset = dirX * cos - dirY * sin;
        const dirYOffset = dirX * sin + dirY * cos;
        return { x: dirXOffset, y: dirYOffset };
    }

    private drawRayOnMap(context: CanvasRenderingContext2D, playerPosition: Position, direction: Vector2, distance: number): void {
        const startX = playerPosition.x * this.blockSize;
        const startY = playerPosition.y * this.blockSize;
        const endX = (playerPosition.x + (direction.x * distance)) * this.blockSize;
        const endY = (playerPosition.y + (direction.y * distance)) * this.blockSize;

        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = this.color;
        context.stroke();
    }

    private getDistanceToWall(direction: Vector2, mapCanvasContext: CanvasRenderingContext2D): number {
        const isWall = (position: Vector2) => {
            const result = this.map.isBlockType(position, BlockType.Wall);
            if (result) {
                this.drawDebugWallBlock(mapCanvasContext!, position);
            }
            return result;
        };

        const distanceAndCellPosition = this.dda.getDistanceToCellType(this.player.position, direction, isWall, this.map.cols, this.map.rows);
        this.distanceToWall = distanceAndCellPosition.distanceToWantedCell;
        this.cellPosition = distanceAndCellPosition.cellPosition;

        return this.distanceToWall;
    }

    private drawDebugWallBlock(context: CanvasRenderingContext2D, position: Vector2): void {
        const x = position.x * this.blockSize;
        const y = position.y * this.blockSize;
        context!.fillStyle = "rgba(0, 255, 0, 0.5)";
        context!.fillRect(x, y, this.blockSize, this.blockSize);
    }

}
