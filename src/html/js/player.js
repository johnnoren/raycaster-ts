import { CanvasId } from "./game.js";
import { BlockType } from "./maze2dFactory.js";
import { Vector2 } from "./math/vector2.js";
import { Direction } from "./math/direction.js";
export class Player {
    constructor(position, direction, status, maze) {
        this.position = position;
        this.direction = direction;
        this.status = status;
        this.maze = maze;
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
        this.turn(-3);
    }
    turnRight() {
        this.turn(3);
    }
    moveForward() {
        this.move(0.02);
    }
    moveBackward() {
        this.move(-0.02);
    }
    turn(angle) {
        const radians = angle * Math.PI / 180;
        const cosAngle = Math.cos(radians);
        const sinAngle = Math.sin(radians);
        const rotationMatrix = [
            [cosAngle, -sinAngle],
            [sinAngle, cosAngle]
        ];
        this.direction = new Direction(this.multiplyMatrixAndVector(rotationMatrix, this.direction.vector));
    }
    move(distance) {
        const newPosition = {
            x: this.position.x + distance * this.direction.x,
            y: this.position.y + distance * this.direction.y
        };
        if (!this.maze.isBlockType(newPosition, BlockType.Wall)) {
            this.position = newPosition;
        }
    }
    multiplyMatrixAndVector(matrix, vector) {
        const x = matrix[0][0] * vector.x + matrix[0][1] * vector.y;
        const y = matrix[1][0] * vector.x + matrix[1][1] * vector.y;
        return new Vector2(x, y);
    }
}
