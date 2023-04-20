import { CanvasId } from "./game.js";
import { BlockType } from "./maze2dFactory.js";
export class Ray {
    constructor(player, status, map, angle, rayNumber, numberOfRays, color, distanceToProjectionPlane, blockSize, dda) {
        this.player = player;
        this.status = status;
        this.map = map;
        this.angle = angle;
        this.rayNumber = rayNumber;
        this.numberOfRays = numberOfRays;
        this.color = color;
        this.distanceToProjectionPlane = distanceToProjectionPlane;
        this.blockSize = blockSize;
        this.dda = dda;
        this.distanceToWall = 0;
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
        this.distanceToWall = this.getDistanceToWall(direction, mapCanvasContext);
        this.drawRayOnMap(mapCanvasContext, this.player.position, direction, this.distanceToWall);
    }
    renderFov(fovCanvas) {
        const fovCanvasContext = fovCanvas.getContext('2d');
        const correctedDistanceToWall = this.distanceToWall * Math.cos(this.angle);
        const wallHeight = (this.blockSize / correctedDistanceToWall) * this.distanceToProjectionPlane;
        const wallColumnWidth = fovCanvas.width / this.numberOfRays;
        const wallColumnX = this.rayNumber * wallColumnWidth;
        fovCanvasContext.fillStyle = "rgba(255, 0, 0, 0.5)";
        fovCanvasContext.fillRect(wallColumnX, fovCanvas.height / 2 - wallHeight / 2, wallColumnWidth, wallHeight);
    }
    getOffsetAdjustedDirection(direction) {
        const { x: dirX, y: dirY } = direction;
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        const dirXOffset = dirX * cos - dirY * sin;
        const dirYOffset = dirX * sin + dirY * cos;
        return { x: dirXOffset, y: dirYOffset };
    }
    drawRayOnMap(context, playerPosition, direction, distance) {
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
    getDistanceToWall(direction, mapCanvasContext) {
        const isWall = (position) => {
            const result = this.map.isBlockType(position, BlockType.Wall);
            if (result) {
                this.drawDebugWallBlock(mapCanvasContext, position);
            }
            return result;
        };
        const distance = this.dda.getDistanceToCellType(this.player.position, direction, isWall, this.map.cols, this.map.rows);
        return distance;
    }
    drawDebugWallBlock(context, position) {
        const x = position.x * this.blockSize;
        const y = position.y * this.blockSize;
        context.fillStyle = "rgba(0, 255, 0, 0.5)";
        context.fillRect(x, y, this.blockSize, this.blockSize);
    }
}
