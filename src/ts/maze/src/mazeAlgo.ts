import { Grid2d } from "./grid2d.js";

export interface MazeAlgo<T> {
    createMaze(grid: Grid2d<T>): Grid2d<T>;
}