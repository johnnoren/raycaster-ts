import { Dda } from "../math/dda.js";
import { CanvasId } from "../game.js";
import { GameObject, Status } from "../gameObject.js";
import { BlockType, Map2 } from "../gameObjects/map2.js";
import { Player } from "./player.js";
import { Vector2 } from "../math/vector2.js";
import { Direction } from "../math/direction.js";

export class Ray implements GameObject {
    private wallCellCollisionVector: Vector2 = new Vector2(0, 0);

    constructor(private player: Player, public status: Status, private map: Map2, private relativeAngle: number, private rayNumber: number, private numberOfRays: number, private color: string, private distanceToProjectionPlane: number, private blockSize: number, private dda: Dda) { }

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
    
        this.wallCellCollisionVector = this.getWallCellCollisionVector(direction);
    
        this.drawRayOnMap(mapCanvasContext!, this.player.position, this.wallCellCollisionVector);
    }
    
    private renderFov(fovCanvas: HTMLCanvasElement): void {
        const fovCanvasContext = fovCanvas.getContext('2d');
        const wallHeightScalingFactor = 0.10; // Adjust this value to increase or decrease the wall height
            const magnitude = this.wallCellCollisionVector.magnitude;
            const fishEyeCorrectedDistance = magnitude * Math.cos(this.relativeAngle);
            const wallHeight = ((this.blockSize * this.distanceToProjectionPlane) / fishEyeCorrectedDistance) * wallHeightScalingFactor;
            const wallColumnWidth = (fovCanvas.width / this.numberOfRays);
            const wallColumnX = this.rayNumber * wallColumnWidth;

            let wallColor = 100 / fishEyeCorrectedDistance;
    
            if (wallColor > 100) {
                wallColor = 100;
            }

            fovCanvasContext!.fillStyle = "rgba(" + wallColor + ", " + wallColor + ", " + wallColor + ", 1)";
            fovCanvasContext!.fillRect(wallColumnX, fovCanvas.height / 2 - wallHeight / 2, wallColumnWidth, wallHeight);
        
    }
    
    private getOffsetAdjustedDirection(direction: Direction): Direction {
        const { x: dirX, y: dirY } = direction;
        const cos = Math.cos(this.relativeAngle);
        const sin = Math.sin(this.relativeAngle);
        const dirXOffset = dirX * cos - dirY * sin;
        const dirYOffset = dirX * sin + dirY * cos;
        const newVector = new Vector2(dirXOffset, dirYOffset);
        return new Direction(newVector);
    }
    

    private drawRayOnMap(context: CanvasRenderingContext2D, playerPosition: Vector2, wallCellCollisionVector: Vector2): void {
        const startX = playerPosition.x * this.blockSize;
        const startY = playerPosition.y * this.blockSize;
        const endX = (playerPosition.x + wallCellCollisionVector.x) * this.blockSize;
        const endY = (playerPosition.y + wallCellCollisionVector.y) * this.blockSize;

        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = this.color;
        context.stroke();
    }

    private getWallCellCollisionVector(direction: Direction): Vector2 {
        const isWall = (position: Vector2) => {
            const result = this.map.isBlockType(position, BlockType.Wall);

            return result;
        };

        return this.dda.getCellCollisionVector(this.player.position, direction, isWall, this.map.cols, this.map.rows);

    }

}
