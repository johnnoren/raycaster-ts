import { Grid2d } from "./grid2d.js";
import { MazeAlgo } from "./mazeAlgo.js";

export class MazeBuilder {
    private algo: MazeAlgo<number>;
    private grid: Grid2d<number>;

    constructor(algo: MazeAlgo<number>) {
        this.algo = algo;

    }

    

    build(): Grid2d<number> {
        return this.grid;
      }
}