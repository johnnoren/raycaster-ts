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
        const { x: dirX, y: dirY } = this.player.direction;
        const { dirXOffset, dirYOffset } = this.getOffsetAdjustedDirection(dirX, dirY);
        this.distanceToWall = this.getDistanceToWall(dirXOffset, dirYOffset);
        this.drawRayOnMap(mapCanvasContext, this.player.position, dirXOffset, dirYOffset, this.distanceToWall);
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
    getOffsetAdjustedDirection(dirX, dirY) {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        const dirXOffset = dirX * cos - dirY * sin;
        const dirYOffset = dirX * sin + dirY * cos;
        return { dirXOffset, dirYOffset };
    }
    drawRayOnMap(context, playerPosition, dirX, dirY, distance) {
        const startX = playerPosition.x * this.blockSize;
        const startY = playerPosition.y * this.blockSize;
        distance = distance * this.blockSize;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + dirX * distance, startY + dirY * distance);
        context.strokeStyle = this.color;
        context.stroke();
    }
    getDistanceToWall(dirX, dirY) {
        const { x: startX, y: startY } = this.player.position;
        const startPosition = { x: startX, y: startY };
        const direction = { x: dirX, y: dirY };
        const distance = this.dda.getDistanceToCellType(startPosition, direction, (position) => this.map.isBlockType(position, BlockType.Wall), this.map.cols);
        return distance;
    }
}
