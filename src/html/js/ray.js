import { BlockType } from "./maze2dFactory.js";
export class Ray {
    constructor(player, status, map, angle) {
        this.player = player;
        this.status = status;
        this.map = map;
        this.angle = angle;
    }
    update() { }
    render(canvas) {
        const context = canvas.getContext("2d");
        const { x: startX, y: startY } = this.player.position;
        const { x: dirX, y: dirY } = this.player.direction;
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        const dirXOffset = dirX * cos - dirY * sin;
        const dirYOffset = dirX * sin + dirY * cos;
        const distanceToWall = this.getDistanceToWall(startX, startY, dirXOffset, dirYOffset, canvas);
        this.drawRay(context, startX, startY, dirXOffset, dirYOffset, distanceToWall);
    }
    drawRay(context, startX, startY, dirX, dirY, distance) {
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + dirX * distance, startY + dirY * distance);
        context.strokeStyle = "red";
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
