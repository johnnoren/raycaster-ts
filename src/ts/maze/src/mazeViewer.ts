import { Grid2d } from "./grid2d";

export class MazeViewer {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  constructor(canvasWidth: number = 500, canvasHeight: number = 500) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    const box = document.getElementById('maze') as HTMLDivElement;
    box.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
    box.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d')!;
  }

  public draw(maze: Grid2d<number>, ): void {
    const tileSize = this.canvas.width / maze.cols;

    maze.forEach((tile, x, y) => {
      if (tile === 0) {
        this.context.fillStyle = 'white';
      } else if (tile === 1) {
        this.context.fillStyle = 'black';
      } else {
        throw new Error(`Invalid value in tile: ${tile}`);
      }

      this.context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    });
  }
}
