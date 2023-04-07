import { Grid2d } from "./grid2d.js";
import { MazeAlgo } from "./mazeAlgo.js";

export class KruskalsAlgo implements MazeAlgo<number> {

    createMaze(grid: Grid2d<number>): Grid2d<number> {
        const gridIsWrongSize = grid.rows % 2 === 0 || grid.cols % 2 === 0;
        if (gridIsWrongSize) {
            throw new Error("Grid must have odd number of rows and columns");
        }
        
        // TODO: Implement Kruskal's algorithm

        return grid;
    }
}

