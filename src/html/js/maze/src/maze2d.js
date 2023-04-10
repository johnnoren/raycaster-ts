export class Maze2d {
    constructor(grid, mazeAlgo) {
        this.grid = grid;
        mazeAlgo.generate(grid);
    }
    get rows() {
        return this.grid.rows;
    }
    get cols() {
        return this.grid.cols;
    }
    getAllValues() {
        return this.grid.getAllValues();
    }
    forEachTile(callback) {
        this.grid.forEach(callback);
    }
}
