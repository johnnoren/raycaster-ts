import { Status } from "./gameObject.js";
import { Cell, Map2, Location, BlockType, CellType } from "./gameObjects/map2.js";
import { Vector2 } from "./math/vector2.js";

export class MazeMap2Factory {
    private readonly isEven = (n: number) => { return n % 2 === 0; };
    private readonly isOdd = (n: number) => { return n % 2 === 1; };

    public createMaze(cols: number, rows: number): Map2 {
        if (rows < 3 || cols < 3) {
            throw new Error("The maze must have at least 3 rows and 3 cols");
        }
        if (this.isEven(rows) || this.isEven(cols)) {
            throw new Error("The maze must have an odd number of rows and cols");
        }
        const cells: Cell[] = [];
        this.initializeCells(cols, rows, cells);
        this.generateMaze(cells);
        return new Map2(cells, cols, rows, Status.Active);
    }

    private initializeCells(cols: number, rows: number, cells: Cell[]): void {
        let counter = 0;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const cell: Cell = {
                    type: this.getCellType(new Vector2(x, y)),
                    location: this.getLocation(new Vector2(x, y), cols, rows),
                    group: counter,
                    blockType: BlockType.Wall,
                    position: new Vector2(x, y),
                };
                cells.push(cell);
                counter++;
            }
        }
    }

    private getCellType({ x, y }: Vector2): CellType {
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

    private getLocation({ x, y }: Vector2, cols: number, rows: number): Location {
        const isPartOfPerimeter = y === 0 || y === rows - 1 || x === 0 || x === cols - 1;

        return isPartOfPerimeter ? Location.Perimeter : Location.Inner;
    }

    private getConnectedCells(cell: Cell, cells: Cell[]): Cell[] {
        const x = cell.position.x;
        const y = cell.position.y;

        if (cell.type === CellType.Intersection && cell.location === Location.Inner) {
            const positionsAboveAndBelow = [new Vector2(x, y - 1), new Vector2(x, y + 1)]
            const positionsLeftAndRight = [new Vector2(x - 1, y), new Vector2(x + 1, y)]
            const connectedPositions: Vector2[] = (this.isEven(x) ? positionsLeftAndRight : positionsAboveAndBelow);

            return cells.filter(cell => cell.position.equals(connectedPositions[0]!) ||
                cell.position.equals(connectedPositions[1]!));
        }
        throw new Error("getConnectedCells() is not implemented for this cell type");
    }

    private generateMaze(cells: Cell[]): void {
        const innerIntersectionCells = cells.filter(cell => cell.location === Location.Inner && cell.type === CellType.Intersection);
        const shuffledInnerIntersectionCells = this.shuffleArray(innerIntersectionCells);

        shuffledInnerIntersectionCells.forEach(interSectionCell => {
            const connectedCells = this.getConnectedCells(interSectionCell, cells);
            const lowestGroupValue = Math.min(connectedCells[0]!.group, connectedCells[1]!.group);
            const highestGroupValue = Math.max(connectedCells[0]!.group, connectedCells[1]!.group);

            if (lowestGroupValue !== highestGroupValue) {
                interSectionCell.blockType = BlockType.Path;
                cells.forEach(cell => {
                    if (cell.group === highestGroupValue || cell.group === lowestGroupValue) {
                        cell.group = lowestGroupValue;
                        cell.blockType = BlockType.Path;
                    }
                });
            }
        });

        this.addExit(cells);
    }

    private addExit(cells: Cell[]): void {
        const perimeterIntersectionCells = cells.filter(cell => cell.location === Location.Perimeter && cell.type === CellType.Intersection);
        const exitCell = this.shuffleArray(perimeterIntersectionCells)[0];
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