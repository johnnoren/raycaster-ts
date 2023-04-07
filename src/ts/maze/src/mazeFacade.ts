import { Grid2d } from './grid2d.js';
import { KruskalsAlgo } from './kruskalsAlgo.js';
import { MazeAlgo } from './mazeAlgo.js';
import { MazeViewer } from './mazeViewer.js';

export class MazeFacade {
    private algo: MazeAlgo<number> = new KruskalsAlgo();

    getMaze(cols: number, rows: number, exits: number): Grid2d<number> {
        const grid = new Grid2d<number>(cols, rows, () => 1);
        return this.algo.createMaze(grid);
    }

    getViewer(canvasWidth: number, canvasHeight: number): MazeViewer {
        return new MazeViewer(canvasWidth, canvasHeight);
    }
}