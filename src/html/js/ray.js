import { CanvasId } from "./game.js";
import { BlockType } from "./maze2dFactory.js";
export class Ray {
    constructor(player, status, map, angle, rayNumber, numberOfRays, color) {
        this.player = player;
        this.status = status;
        this.map = map;
        this.angle = angle;
        this.rayNumber = rayNumber;
        this.numberOfRays = numberOfRays;
        this.color = color;
        this.distanceToWall = 0;
        this.wallScaleFactor = 8;
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
        const { x: startX, y: startY } = this.player.position;
        const { x: dirX, y: dirY } = this.player.direction;
        const { dirXOffset, dirYOffset } = this.getOffsetAdjustedDirection(dirX, dirY);
        this.distanceToWall = this.getDistanceToWall(startX, startY, dirXOffset, dirYOffset, mapCanvas);
        this.drawRayOnMap(mapCanvasContext, startX, startY, dirXOffset, dirYOffset, this.distanceToWall);
    }
    renderFov(fovCanvas) {
        const fovCanvasContext = fovCanvas.getContext('2d');
        const distanceToWall = this.distanceToWall;
        const wallHeight = (fovCanvas.height / distanceToWall) * this.wallScaleFactor;
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
    drawRayOnMap(context, startX, startY, dirX, dirY, distance) {
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + dirX * distance, startY + dirY * distance);
        context.strokeStyle = this.color;
        context.stroke();
    }
    getDistanceToWall(startX, startY, dirX, dirY, canvas) {
        let distance = 0;
        let hitWall = false;
        while (!hitWall && distance < canvas.width) {
            const x = startX + dirX * distance;
            const y = startY + dirY * distance;
            if (this.map.isBlockType({ x, y }, BlockType.Wall)) {
                hitWall = true;
            }
            else {
                distance++;
            }
        }
        return distance;
    }
}
