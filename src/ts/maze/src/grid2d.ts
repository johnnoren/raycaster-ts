export type Position = [x: number, y: number];

export class Grid2d {
    private rows: number;
    private cols: number;
    private grid: number[][];
    private blockTypes: { [key: string]: number } = {
        "wall": 1,
        "path": 0,
    };
    private rightmostCol: number;
    private leftmostCol: number = 0;
    private topmostRow: number = 0;
    private bottommostRow: number;

    private rightmostInnerCellCol: number;
    private leftmostInnerCellCol: number = 1;
    private topmostInnerCellRow: number = 1;
    private bottommostInnerCellRow: number;

    private isEven = (n: number) => { return n % 2 === 0; };
    private isOdd = (n: number) => { return n % 2 === 1; };

    private isLocatedAtTopOrBottomEdge = (y: number) => y === this.topmostRow || y === this.bottommostRow;
    private isLocatedAtLeftOrRightEdge = (x: number) => x === this.leftmostCol || x === this.rightmostCol;

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.grid = Array(cols).fill(Array(rows).fill(this.blockTypes.wall));
        this.rightmostCol = cols - 1;
        this.bottommostRow = rows - 1;
        this.rightmostInnerCellCol = cols - 2;
        this.bottommostInnerCellRow = rows - 2;
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
}