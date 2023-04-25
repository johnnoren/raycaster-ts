import { CanvasId } from "../game.js";
import { BlockType } from "../gameObjects/map2.js";
import { Vector2 } from "../math/vector2.js";
import { Direction } from "../math/direction.js";
export class Ray {
    constructor(player, status, map, relativeAngle, rayNumber, numberOfRays, color, distanceToProjectionPlane, blockSize, dda) {
        this.player = player;
        this.status = status;
        this.map = map;
        this.relativeAngle = relativeAngle;
        this.rayNumber = rayNumber;
        this.numberOfRays = numberOfRays;
        this.color = color;
        this.distanceToProjectionPlane = distanceToProjectionPlane;
        this.blockSize = blockSize;
        this.dda = dda;
        this.wallCellCollisionVector = new Vector2(0, 0);
    }
    update() { }
    render(canvases) {
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
    renderMap(mapCanvas) {
        const mapCanvasContext = mapCanvas.getContext('2d');
        const direction = this.getOffsetAdjustedDirection(this.player.direction);
        this.wallCellCollisionVector = this.getWallCellCollisionVector(direction);
        this.drawRayOnMap(mapCanvasContext, this.player.position, this.wallCellCollisionVector);
    }
    renderFov(fovCanvas) {
        const fovCanvasContext = fovCanvas.getContext('2d');
        const wallHeightScalingFactor = 0.10;
        const magnitude = this.wallCellCollisionVector.magnitude;
        const fishEyeCorrectedDistance = magnitude * Math.cos(this.relativeAngle);
        const wallHeight = ((this.blockSize * this.distanceToProjectionPlane) / fishEyeCorrectedDistance) * wallHeightScalingFactor;
        const wallColumnWidth = (fovCanvas.width / this.numberOfRays);
        const wallColumnX = this.rayNumber * wallColumnWidth;
        let wallColor = 100 / fishEyeCorrectedDistance;
        if (wallColor > 100) {
            wallColor = 100;
        }
        fovCanvasContext.fillStyle = "rgba(" + wallColor + ", " + wallColor + ", " + wallColor + ", 1)";
        fovCanvasContext.fillRect(wallColumnX, fovCanvas.height / 2 - wallHeight / 2, wallColumnWidth, wallHeight);
    }
    getOffsetAdjustedDirection(direction) {
        const { x: dirX, y: dirY } = direction;
        const cos = Math.cos(this.relativeAngle);
        const sin = Math.sin(this.relativeAngle);
        const dirXOffset = dirX * cos - dirY * sin;
        const dirYOffset = dirX * sin + dirY * cos;
        const newVector = new Vector2(dirXOffset, dirYOffset);
        return new Direction(newVector);
    }
    drawRayOnMap(context, playerPosition, wallCellCollisionVector) {
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
    getWallCellCollisionVector(direction) {
        const isWall = (position) => {
            const result = this.map.isBlockType(position, BlockType.Wall);
            return result;
        };
        return this.dda.getCellCollisionVector(this.player.position, direction, isWall, this.map.cols, this.map.rows);
    }
}
