import { CanvasId } from "../game.js";
import { Vector2 } from "../math/vector2.js";
import { BlockType } from "../gameObjects/map2.js";
export class Player {
    constructor(position, direction, status, map) {
        this.position = position;
        this.direction = direction;
        this.status = status;
        this.map = map;
    }
    update() {
    }
    render(canvases, blockSize) {
        canvases.forEach((canvas) => {
            switch (canvas.id) {
                case CanvasId.map:
                    this.renderMap(canvas, blockSize);
                    break;
                case CanvasId.fov:
                    break;
                default: throw new Error("CanvasId not implemented: " + canvas.id);
            }
        });
    }
    renderMap(canvas, blockSize) {
        const x = this.position.x * blockSize;
        const y = this.position.y * blockSize;
        const context = canvas.getContext('2d');
        const radius = 3;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = 'lime';
        context.fill();
        context.closePath();
    }
    turnLeft() {
        this.direction = this.direction.rotate(-0.052);
    }
    turnRight() {
        this.direction = this.direction.rotate(0.052);
    }
    moveForward() {
        this.move(0.02);
    }
    moveBackward() {
        this.move(-0.02);
    }
    move(distance) {
        const newPosition = new Vector2(this.position.x + distance * this.direction.x, this.position.y + distance * this.direction.y);
        if (!this.map.isBlockType(newPosition, BlockType.Wall)) {
            this.position = newPosition;
        }
    }
}
