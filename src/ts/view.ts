import { Maze2d, BlockType } from "./maze2d.js";
import { Player } from "./player.js";

export class View {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private readonly maze: Maze2d;
    private readonly player: Player;
    private readonly tileSize: number;

    constructor(maze: Maze2d, canvasWidth: number = 500, canvasHeight: number = 500, player: Player) {
        this.maze = maze;
        this.canvas = document.createElement('canvas');
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        const box = document.getElementById('maze') as HTMLDivElement;
        box.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
        box.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d')!;
        this.player = player;
        this.tileSize = this.canvas.width / this.maze.cols;
    }

    public draw(): void {
        this.drawMaze();
        
        this.player.drawPlayer(this.context, this.tileSize);
    }

    private drawMaze(): void {
        this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        const grid = this.maze.cells;
        grid.forEach((cell) => {
            switch (cell.blockType) {
                case BlockType.Wall:
                    this.context.fillStyle = 'black';
                    break;
                case BlockType.Path:
                    this.context.fillStyle = 'white';
                    break;
                case BlockType.Start:
                    this.context.fillStyle = 'green';
                    break;
                default:
                    throw new Error(`BlockType in cell not implemented: ${cell.blockType}`);
            }

            const x = cell.position[0];
            const y = cell.position[1];
            this.context.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
        });
    }
}
