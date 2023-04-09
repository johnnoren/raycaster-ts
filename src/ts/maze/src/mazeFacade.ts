import { Grid2dFacade } from '../../grid/src/index.js';
import { KruskalsAlgo } from './kruskalsAlgo.js';
import { Maze2d } from "./maze2d.js";
import { MazeAlgo } from './mazeAlgo.js';
import { MazeViewer } from './mazeViewer.js';

export class MazeFacade {
    private algo: MazeAlgo = new KruskalsAlgo();

    getRandom(cols: number, rows: number, exits: number): Maze2d {
        const facade = new Grid2dFacade();
        return Maze2d.createRandom(facade, cols, rows, exits, this.algo);
    }
    
    getFromSeed(seed: string): Maze2d {
        const facade = new Grid2dFacade();
        return Maze2d.fromSeed(facade, seed, this.algo);
    }

    getViewer(maze: Maze2d, canvasWidth: number, canvasHeight: number): MazeViewer {
        return new MazeViewer(maze, canvasWidth, canvasHeight);
    }
}