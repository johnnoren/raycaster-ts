type Position = [x: number, y: number];

enum CellType {
    Intersection,
    Regular,
    Static,
}

enum Location {
    Perimeter,
    Inner,
}

export enum BlockType {
    Wall,
    Path,
}

type Cell = {
    type: CellType;
    location: Location;
    group: number;
    blockType: BlockType;
    position: Position;
}

export class Maze2d {
    private readonly isEven = (n: number) => { return n % 2 === 0; };
    private readonly isOdd = (n: number) => { return n % 2 === 1; };

    public readonly cells: Cell[] = [];

    constructor(public readonly cols: number, public readonly rows: number) {
        if (rows < 3 || cols < 3) {
            throw new Error("The maze must have at least 3 rows and 3 cols");
        }
        if (this.isEven(rows) || this.isEven(cols)) {
            throw new Error("The maze must have an odd number of rows and cols");
        }

        this.initializeCells(cols, rows);

        this.generateMaze();
    }

    private initializeCells(cols: number, rows: number): void {
        let counter = 0;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const cell: Cell = {
                    type: this.getCellType([x, y]),
                    location: this.getLocation([x, y]),
                    group: counter,
                    blockType: BlockType.Wall,
                    position: [x, y],
                };
                this.cells.push(cell);
                counter++;
            }
        }
    }

    private getCellType([x, y]: Position): CellType {
        if (this.isOdd(x) && this.isOdd(y)) {
            return CellType.Regular;
        }
        if (this.isOdd(x) && this.isEven(y)) {
            return CellType.Intersection;
        }
        if (this.isEven(x) && this.isOdd(y)) {
            return CellType.Intersection;
        }
        return CellType.Static;
    }

    private getLocation([x, y]: Position): Location {
        const isPartOfPerimeter = y === 0 || y === this.rows - 1 || x === 0 || x === this.cols - 1;

        return isPartOfPerimeter ? Location.Perimeter : Location.Inner;
    }

    private getConnectedCells(cell: Cell): Cell[] {
        const x = cell.position[0];
        const y = cell.position[1];
        const positionsAreSame = (position1: Position, position2: Position) => {
            return position1[0] === position2[0] && position1[1] === position2[1];
        };
          
        if (cell.type === CellType.Intersection && cell.location === Location.Inner) {
            const connectedPositions: [Position, Position] = (this.isEven(x) ? [[x-1,y],[x+1,y]] : [[x,y-1],[x,y+1]]);

            return this.cells.filter(cell => positionsAreSame(cell.position, connectedPositions[0]) || 
            positionsAreSame(cell.position, connectedPositions[1]));
        }
        throw new Error("getConnectedCells() is not implemented for this cell type");
    }

    private generateMaze(): void {
        const innerIntersectionCells = this.cells.filter(cell => cell.location === Location.Inner && cell.type === CellType.Intersection);
        const shuffledInnerIntersectionCells = this.shuffleArray(innerIntersectionCells);

        shuffledInnerIntersectionCells.forEach(interSectionCell => {
            const connectedCells = this.getConnectedCells(interSectionCell);
            const lowestGroupValue = Math.min(connectedCells[0]!.group, connectedCells[1]!.group);
            const highestGroupValue = Math.max(connectedCells[0]!.group, connectedCells[1]!.group);

            if (lowestGroupValue !== highestGroupValue) {
                interSectionCell.blockType = BlockType.Path;
                this.cells.forEach(cell => {
                    if (cell.group === highestGroupValue || cell.group === lowestGroupValue) {
                        cell.group = lowestGroupValue;
                        cell.blockType = BlockType.Path;
                    }
                });
            } 
        });

        this.addExit();
    }

    private addExit(): void {
        const perimeterIntersectionCells = this.cells.filter(cell => cell.location === Location.Perimeter && cell.type === CellType.Intersection);
        const shuffledPerimeterIntersectionCells = this.shuffleArray(perimeterIntersectionCells);
        const exitCell = shuffledPerimeterIntersectionCells[0];
        exitCell.blockType = BlockType.Path;
    }

    private shuffleArray(array: any[]): any[] {
        function randomSort<T>(_a: T, _b: T): number {
            return Math.random() < 0.5 ? -1 : 1;
        }
        
        array.sort(randomSort);
        return array;
    }
}