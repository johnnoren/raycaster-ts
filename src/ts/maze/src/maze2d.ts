import { Grid2d } from './grid2d.js';
import { MazeAlgo } from './mazeAlgo.js';

export class Maze2d {
    private readonly grid: Grid2d;

    constructor(grid: Grid2d, mazeAlgo: MazeAlgo) {
        this.grid = grid;
        mazeAlgo.generate(grid);
    }

    get rows(): number {
        return this.grid.rows;
    }

    get cols(): number {
        return this.grid.cols;
    }

    getAllValues(): number[] {
        return this.grid.getAllValues();
    }

    forEachTile(callback: (value: number, x: number, y: number) => void): void {
        this.grid.forEach(callback);
    }

}