export type Position = [x: number, y: number];

export class Grid2d {
    public readonly cols: number;
    public readonly rows: number;
    private readonly grid: number[][];
    private readonly blockTypes: { [key: string]: number } = {
        "wall": 1,
        "path": 0,
    };
    private readonly rightmostCol: number;
    private readonly leftmostCol: number = 0;
    private readonly topmostRow: number = 0;
    private readonly bottommostRow: number;

    private readonly isEven = (n: number) => { return n % 2 === 0; };
    private readonly isOdd = (n: number) => { return n % 2 === 1; };

    private readonly isLocatedAtTopOrBottomEdge = (y: number) => y === this.topmostRow || y === this.bottommostRow;
    private readonly isLocatedAtLeftOrRightEdge = (x: number) => x === this.leftmostCol || x === this.rightmostCol;

    constructor(cols: number, rows: number) {
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

    forEach(callback: (value: number, x: number, y: number) => void): void {
        this.grid.forEach((col, x) => { col.forEach((value, y) => { callback(value, x, y); }); });
    }

    isPerimeterCell([x, y]: Position): boolean {
        return this.isLocatedAtTopOrBottomEdge(y) && this.isOdd(x) || this.isLocatedAtLeftOrRightEdge(x) && this.isOdd(y);
    }

    isPerimeterIntersectionCell([x, y]: Position): boolean {
        return this.isLocatedAtTopOrBottomEdge(y) && this.isEven(x) || this.isLocatedAtLeftOrRightEdge(x) && this.isEven(y);
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

    getPositions(...predicates: (([x, y]: Position) => boolean)[]): Position[] {
        const positions: Position[] = [];
        this.forEach((_value, x, y) => {
            const position: Position = [x, y];
            if (predicates.every(predicate => predicate(position))) {
            positions.push(position);
            }
        });
        return positions;
    }

    fillWithSequentialNumbers(positions: Position[]): void {
        let counter = 0;
        positions.forEach(([x, y]) => {
          this.grid[x]![y] = counter;
          counter++;
        });
    }

    getConnectedCellValues([x, y]: Position): number[] {
        const horizontalNeighbors = [this.grid[x - 1]![y], this.grid[x + 1]![y]].filter(n => typeof n === "number");
        const verticalNeighbors = [this.grid[x]![y - 1], this.grid[x]![y + 1]].filter(n => typeof n === "number");
        
        return (this.isOdd(y)) ? horizontalNeighbors as number[] : verticalNeighbors as number[];
    }
    
    getInnerCellPositions(): Position[] {
        return this.getPositions(this.isInnerCell);
    }

    getInnerIntersectionCellPositions(): Position[] {
        return this.getPositions(this.isInnerIntersectionCell);
    }

    getCellsByValue(value: number): Position[] {
        return this.getPositions(([x, y]) => this.grid[x]![y] === value);
    }

    setCellsToValue(positions: Position[], value: number): void {
        positions.forEach(([x, y]) => { this.grid[x]![y] = value; });
    }

    addExit() {
        const possibleExitPositions = this.getPositions(this.isPerimeterIntersectionCell);
        const exitPosition = possibleExitPositions[Math.floor(Math.random() * possibleExitPositions.length)];

        this.setCellsToValue([exitPosition!], this.blockTypes.path!);
    }

}