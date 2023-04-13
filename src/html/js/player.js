import { BlockType } from "./maze2dFactory.js";
export class Player {
    constructor(position, direction, status, maze) {
        this.position = position;
        this.direction = direction;
        this.status = status;
        this.maze = maze;
    }
    update() {
    }
    render(canvas) {
        const { x, y } = this.position;
        const context = canvas.getContext('2d');
        const radius = 5;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = 'green';
        context.fill();
        context.closePath();
    }
    turnLeft() {
        this.turn(-2);
    }
    turnRight() {
        this.turn(2);
    }
    moveForward() {
        this.move(0.5);
    }
    moveBackward() {
        this.move(-0.5);
    }
    turn(angle) {
        const radians = angle * Math.PI / 180;
        const cosAngle = Math.cos(radians);
        const sinAngle = Math.sin(radians);
        const rotationMatrix = [
            [cosAngle, -sinAngle],
            [sinAngle, cosAngle]
        ];
        const newDirection = this.multiplyMatrixAndVector(rotationMatrix, this.direction);
        this.direction = newDirection;
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
        return { x, y };
    }
}
