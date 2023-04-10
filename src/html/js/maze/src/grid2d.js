export class Grid2d {
    constructor(cols, rows) {
        this.grid = [];
        this.blockTypes = {
            "wall": 0,
            "path": 1,
            "temp": 2,
        };
        this.leftmostCol = 0;
        this.topmostRow = 0;
        this.isEven = (n) => { return n % 2 === 0; };
        this.isOdd = (n) => { return n % 2 === 1; };
        if (rows < 3 || cols < 3) {
            throw new Error("Grid2d must have at least 3 rows and 3 cols");
        }
        if (rows % 2 === 0 || cols % 2 === 0) {
            throw new Error("Grid2d must have an odd number of rows and cols");
        }
        this.cols = cols;
        this.rows = rows;
        for (let x = 0; x < cols; x++) {
            const column = Array(rows).fill(this.blockTypes.wall);
            this.grid.push(column);
        }
        this.rightmostCol = cols - 1;
        this.bottommostRow = rows - 1;
    }
    isLocatedAtTopOrBottomEdge(y) {
        return y === this.topmostRow || y === this.bottommostRow;
    }
    isLocatedAtLeftOrRightEdge(x) {
        return x === this.leftmostCol || x === this.rightmostCol;
    }
    forEach(callback) {
        this.grid.forEach((col, x) => { col.forEach((value, y) => { callback(value, x, y); }); });
    }
    isPerimeterIntersectionCell([x, y]) {
        return this.isLocatedAtTopOrBottomEdge(y) && this.isOdd(x) || this.isLocatedAtLeftOrRightEdge(x) && this.isOdd(y);
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
    isAnyTypeOfInnerCell([x, y]) {
        return this.isInnerCell([x, y]) || this.isInnerIntersectionCell([x, y]);
    }
    getPositions(...predicates) {
        const positions = [];
        this.forEach((_value, x, y) => {
            const position = [x, y];
            if (predicates.every(predicate => predicate(position), this)) {
                positions.push(position);
            }
        });
        return positions;
    }
    fillWithSequentialNumbers(positions) {
        let counter = 2;
        positions.forEach(([x, y]) => {
            this.grid[x][y] = counter;
            counter++;
        });
    }
    getConnectedCellValues([x, y]) {
        const horizontalNeighbors = [this.grid[x - 1][y], this.grid[x + 1][y]].filter(n => typeof n === "number");
        const verticalNeighbors = [this.grid[x][y - 1], this.grid[x][y + 1]].filter(n => typeof n === "number");
        if (!this.isInnerIntersectionCell([x, y])) {
            return [];
        }
        return (this.isOdd(y)) ? horizontalNeighbors : verticalNeighbors;
    }
    getInnerCellPositions() {
        return this.getPositions(this.isInnerCell.bind(this));
    }
    getInnerIntersectionCellPositions() {
        return this.getPositions(this.isInnerIntersectionCell.bind(this));
    }
    getCellsByValue(value) {
        return this.getPositions(([x, y]) => this.grid[x][y] === value);
    }
    getInnerCellPositionsByValue(value) {
        return this.getCellsByValue(value).filter(this.isInnerCell.bind(this));
    }
    getAnyTypeOfInnerCellPositionsByValue(value) {
        return this.getCellsByValue(value).filter(this.isAnyTypeOfInnerCell.bind(this));
    }
    setCellsToValue(positions, value) {
        positions.forEach(([x, y]) => { this.grid[x][y] = value; });
    }
    addExit() {
        const possibleExitPositions = this.getPositions(this.isPerimeterIntersectionCell.bind(this));
        const exitPosition = possibleExitPositions[Math.floor(Math.random() * possibleExitPositions.length)];
        this.setCellsToValue([exitPosition], this.blockTypes.path);
    }
    getValue([x, y]) {
        return this.grid[x][y];
    }
    getAllValues() {
        const values = [];
        this.forEach((value) => { values.push(value); });
        return values;
    }
    getPerimeterIntersectionCellPositions() {
        return this.getPositions(this.isPerimeterIntersectionCell.bind(this));
    }
    getArray() {
        return this.grid;
    }
}
