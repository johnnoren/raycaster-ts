import { Grid2d, Grid2dFacade } from "../../grid/src/index.js";
import { MazeAlgo } from "./mazeAlgo.js";

export class Maze2d {
    public grid: Grid2d<number>;
    public algo: MazeAlgo;
    public seed: string;

    constructor(algo: MazeAlgo, grid: Grid2d<number>) {
        this.grid = grid;
        this.algo = algo;
    }

    static createRandom(grid2dFacade: Grid2dFacade, cols: number, rows: number, exits: number, algo: MazeAlgo): Maze2d {
        const grid = grid2dFacade.getGrid2d(cols, rows, () => 1);
        algo.executeRandom(grid, exits);
        return new Maze2d(algo, grid);
    }

    static fromSeed(grid2dFacade: Grid2dFacade, seed: string, algo: MazeAlgo): Maze2d {
        const seedParts = seed.split('.');
        const cols = parseInt(seedParts[0]!);
        const rows = parseInt(seedParts[1]!);
        const algoSeed = seedParts[2] + '.' + seedParts[3];
        const grid = grid2dFacade.getGrid2d(cols, rows, () => 1);
        algo.executeFromSeed(grid, algoSeed!);
        return new Maze2d(algo, grid);
    }

    toArray(): number[][] {
        return this.grid.toArray();
    }

    get cols(): number {
        return this.grid.cols;
    }

    get rows(): number {
        return this.grid.rows;
    }

}