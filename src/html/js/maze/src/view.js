import { BlockType } from "./maze2d.js";
export class View {
    constructor(maze, canvasWidth = 500, canvasHeight = 500) {
        this.maze = maze;
        this.canvas = document.createElement('canvas');
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        const box = document.getElementById('maze');
        box.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
        box.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
    }
    draw() {
        this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        const tileSize = this.canvas.width / this.maze.cols;
        const grid = this.maze.cells;
        grid.forEach((cell) => {
            switch (cell.blockType) {
                case BlockType.Wall:
                    this.context.fillStyle = 'black';
                    break;
                case BlockType.Path:
                    this.context.fillStyle = 'white';
                    break;
                default:
                    throw new Error(`BlockType in cell not implemented: ${cell.blockType}`);
            }
            const x = cell.position[0];
            const y = cell.position[1];
            this.context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        });
    }
}
