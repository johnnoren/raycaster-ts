export type Position = [x: number, y: number];

export class Grid2d {
    public readonly cols: number;
    public readonly rows: number;
    private readonly grid: number[][] = [];
    public readonly blockTypes: { [key: string]: number } = {
        "wall": 0,
        "path": 1,
        "temp": 2,
    };
    private readonly rightmostCol: number;
    private readonly leftmostCol: number = 0;
    private readonly topmostRow: number = 0;
    private readonly bottommostRow: number;

    private readonly isEven = (n: number) => { return n % 2 === 0; };
    private readonly isOdd = (n: number) => { return n % 2 === 1; };

    constructor(cols: number, rows: number) {
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

    isLocatedAtTopOrBottomEdge(y: number) {
       return y === this.topmostRow || y === this.bottommostRow;
    }

    isLocatedAtLeftOrRightEdge(x: number) {
        return x === this.leftmostCol || x === this.rightmostCol;
    }

    forEach(callback: (value: number, x: number, y: number) => void): void {
        this.grid.forEach((col, x) => { col.forEach((value, y) => { callback(value, x, y); }); });
    }

    isPerimeterIntersectionCell([x, y]: Position): boolean {
        return this.isLocatedAtTopOrBottomEdge(y) && this.isOdd(x) || this.isLocatedAtLeftOrRightEdge(x) && this.isOdd(y);
    }

    isInnerCell([x, y]: Position): boolean {
        if (this.isLocatedAtTopOrBottomEdge(y) || this.isLocatedAtLeftOrRightEdge(x)) {
            return false;
        }
        if (this.isOdd(y)) {
            return this.isOdd(x);
        }
        return false;
    }

    isInnerIntersectionCell([x, y]: Position): boolean {
        if (this.isLocatedAtTopOrBottomEdge(y) || this.isLocatedAtLeftOrRightEdge(x)) {
            return false;
        }
        if (this.isOdd(y)) {
            return this.isEven(x);
        }
        return this.isOdd(x);
    }

    isAnyTypeOfInnerCell([x, y]: Position): boolean {
        return this.isInnerCell([x, y]) || this.isInnerIntersectionCell([x, y]);
    }

    getPositions(...predicates: (([x, y]: Position) => boolean)[]): Position[] {
        const positions: Position[] = [];
        this.forEach((_value, x, y) => {
            const position: Position = [x, y];
            if (predicates.every(predicate => predicate(position), this)) {
                positions.push(position);
            }
        });
        return positions;
    }

    fillWithSequentialNumbers(positions: Position[]): void {
        let counter = 2;
        positions.forEach(([x, y]) => {
            this.grid[x]![y] = counter;
            counter++;
        });
    }

    getConnectedCellValues([x, y]: Position): number[] {
        const horizontalNeighbors = [this.grid[x - 1]![y], this.grid[x + 1]![y]].filter(n => typeof n === "number");
        const verticalNeighbors = [this.grid[x]![y - 1], this.grid[x]![y + 1]].filter(n => typeof n === "number");
        
        if (!this.isInnerIntersectionCell([x, y])) {
            return [];
        }

        return (this.isOdd(y)) ? horizontalNeighbors as number[] : verticalNeighbors as number[];
    }

    getInnerCellPositions(): Position[] {
        return this.getPositions(this.isInnerCell.bind(this));
    }

    getInnerIntersectionCellPositions(): Position[] {
        return this.getPositions(this.isInnerIntersectionCell.bind(this));
    }

    getCellsByValue(value: number): Position[] {
        return this.getPositions(([x, y]) => this.grid[x]![y] === value);
    }

    getInnerCellPositionsByValue(value: number): Position[] {
        return this.getCellsByValue(value).filter(this.isInnerCell.bind(this));
    }

    getAnyTypeOfInnerCellPositionsByValue(value: number): Position[] {
        return this.getCellsByValue(value).filter(this.isAnyTypeOfInnerCell.bind(this));
    }

    setCellsToValue(positions: Position[], value: number): void {
        positions.forEach(([x, y]) => { this.grid[x]![y] = value; });
    }

    addExit() {
        const possibleExitPositions = this.getPositions(this.isPerimeterIntersectionCell.bind(this));
        const exitPosition = possibleExitPositions[Math.floor(Math.random() * possibleExitPositions.length)];

        this.setCellsToValue([exitPosition!], this.blockTypes.path!);
    }

    getValue([x, y]: Position): number {
        return this.grid[x]![y]!;
    }

    getAllValues(): number[] {
        const values: number[] = [];
        this.forEach((value) => { values.push(value); });
        return values;
    }

    getPerimeterIntersectionCellPositions(): Position[] {
        return this.getPositions(this.isPerimeterIntersectionCell.bind(this));
    }

    getArray(): number[][] {
        return this.grid;
    }  

}