import { Grid2d } from "../../grid/src/index.js";

export interface MazeAlgo {

    executeRandom(grid: Grid2d<number>, exits: number): Grid2d<number>;

    executeFromSeed(grid: Grid2d<number>, seed: string): Grid2d<number>;

} 