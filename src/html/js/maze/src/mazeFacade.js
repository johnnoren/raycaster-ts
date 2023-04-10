import { Grid2d } from "./grid2d.js";
import { Maze2d } from "./maze2d.js";
import { MazeAlgo } from "./mazeAlgo.js";
import { MazeViewer } from "./mazeViewer.js";
export class MazeFacade {
    getMaze(cols, rows) {
        const grid = new Grid2d(cols, rows);
        const algo = new MazeAlgo();
        return new Maze2d(grid, algo);
    }
    getMazeViewer(maze, canvasWidth, canvasHeight) {
        return new MazeViewer(maze, canvasWidth, canvasHeight);
    }
}
