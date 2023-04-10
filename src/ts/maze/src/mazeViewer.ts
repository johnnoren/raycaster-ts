import { Maze2d } from "./maze2d.js";

export class MazeViewer {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly maze: Maze2d;

  constructor(maze: Maze2d, canvasWidth: number = 500, canvasHeight: number = 500) {
    this.maze = maze;
    this.canvas = document.createElement('canvas');
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    const box = document.getElementById('maze') as HTMLDivElement;
    box.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
    box.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d')!;
  }

  public draw(): void {
    this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    const tileSize = this.canvas.width / this.maze.cols;
    this.maze.forEachTile((tile, x, y) => {
      if (tile === 0) {
        this.context.fillStyle = 'black';
      } else if (tile === 1) {
        this.context.fillStyle = 'white';
      } else {
        throw new Error(`Invalid value in tile: ${tile}`);
      }

      this.context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    });
  }
}
