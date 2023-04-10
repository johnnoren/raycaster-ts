export class Grid2d {
    constructor(cols, rows) {
        this.blockTypes = {
            "wall": 1,
            "path": 0,
        };
        this.leftmostCol = 0;
        this.topmostRow = 0;
        this.isEven = (n) => { return n % 2 === 0; };
        this.isOdd = (n) => { return n % 2 === 1; };
        this.isLocatedAtTopOrBottomEdge = (y) => y === this.topmostRow || y === this.bottommostRow;
        this.isLocatedAtLeftOrRightEdge = (x) => x === this.leftmostCol || x === this.rightmostCol;
        if (rows < 3 || cols < 3) {
            throw new Error("Grid2d must have at least 3 rows and 3 cols");
        }
        if (rows % 2 === 0 || cols % 2 === 0) {
            throw new Error("Grid2d must have an odd number of rows and cols");
        }
        this.grid = Array(cols).fill(Array(rows).fill(this.blockTypes.wall));
        this.rightmostCol = cols - 1;
        this.bottommostRow = rows - 1;
    }
    forEach(callback) {
        this.grid.forEach((col, x) => { col.forEach((value, y) => { callback(value, x, y); }); });
    }
    isPerimeterCell([x, y]) {
        return this.isLocatedAtTopOrBottomEdge(y) && this.isOdd(x) || this.isLocatedAtLeftOrRightEdge(x) && this.isOdd(y);
    }
    isPerimeterIntersectionCell([x, y]) {
        return this.isLocatedAtTopOrBottomEdge(y) && this.isEven(x) || this.isLocatedAtLeftOrRightEdge(x) && this.isEven(y);
    }
    isInnerCell([x, y]) {
        if (this.isLocatedAtTopOrBottomEdge(y) || this.isLocatedAtLeftOrRightEdge(x)) {
            return false;
        }
        if (this.isOdd(y)) {
            return this.isOdd(x);
        }
        return false;
    }
    isInnerIntersectionCell([x, y]) {
        if (this.isLocatedAtTopOrBottomEdge(y) || this.isLocatedAtLeftOrRightEdge(x)) {
            return false;
        }
        if (this.isOdd(y)) {
            return this.isEven(x);
        }
        return this.isOdd(x);
    }
    getPositions(...predicates) {
        const positions = [];
        this.forEach((_value, x, y) => {
            const position = [x, y];
            if (predicates.every(predicate => predicate(position))) {
                positions.push(position);
            }
        });
        return positions;
    }
    fillWithSequentialNumbers(positions) {
        let counter = 0;
        positions.forEach(([x, y]) => {
            this.grid[x][y] = counter;
            counter++;
        });
    }
    getConnectedCellValues([x, y]) {
        const horizontalNeighbors = [this.grid[x - 1][y], this.grid[x + 1][y]].filter(n => typeof n === "number");
        const verticalNeighbors = [this.grid[x][y - 1], this.grid[x][y + 1]].filter(n => typeof n === "number");
        return (this.isOdd(y)) ? horizontalNeighbors : verticalNeighbors;
    }
    getInnerCellPositions() {
        return this.getPositions(this.isInnerCell);
    }
    getInnerIntersectionCellPositions() {
        return this.getPositions(this.isInnerIntersectionCell);
    }
    getCellsByValue(value) {
        return this.getPositions(([x, y]) => this.grid[x][y] === value);
    }
    setCellsToValue(positions, value) {
        positions.forEach(([x, y]) => { this.grid[x][y] = value; });
    }
    addExit() {
        const possibleExitPositions = this.getPositions(this.isPerimeterIntersectionCell);
        const exitPosition = possibleExitPositions[Math.floor(Math.random() * possibleExitPositions.length)];
        this.setCellsToValue([exitPosition], this.blockTypes.path);
    }
}
