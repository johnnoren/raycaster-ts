import { GameObject, Status } from "./gameObject.js";

export type Position = { x: number, y: number };

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
    Start,
}

export type Cell = {
    type: CellType;
    location: Location;
    group: number;
    blockType: BlockType;
    position: Position;
}

export class Maze2dFactory {
    private readonly isEven = (n: number) => { return n % 2 === 0; };
    private readonly isOdd = (n: number) => { return n % 2 === 1; };

    public createMaze(cols: number, rows: number, tileSize: number): Maze2d {
        if (rows < 3 || cols < 3) {
            throw new Error("The maze must have at least 3 rows and 3 cols");
        }
        if (this.isEven(rows) || this.isEven(cols)) {
            throw new Error("The maze must have an odd number of rows and cols");
        }
        const cells: Cell[] = [];
        this.initializeCells(cols, rows, cells);
        this.generateMaze(cols, rows, cells);
        return new Maze2dImpl(cells, cols, Status.Active, tileSize) as Maze2d;
    }

    private initializeCells(cols: number, rows: number, cells: Cell[]): void {
        let counter = 0;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const cell: Cell = {
                    type: this.getCellType({ x, y }),
                    location: this.getLocation({ x, y }, cols, rows),
                    group: counter,
                    blockType: BlockType.Wall,
                    position: { x, y },
                };
                cells.push(cell);
                counter++;
            }
        }
    }

    private getCellType({ x, y }: Position): CellType {
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

    private getLocation({ x, y }: Position, cols: number, rows: number): Location {
        const isPartOfPerimeter = y === 0 || y === rows - 1 || x === 0 || x === cols - 1;

        return isPartOfPerimeter ? Location.Perimeter : Location.Inner;
    }

    private getConnectedCells(cell: Cell, cells: Cell[]): Cell[] {
        const x = cell.position.x;
        const y = cell.position.y;
        const positionsAreSame = (position1: Position, position2: Position) => {
            return position1.x === position2.x && position1.y === position2.y;
        };

        if (cell.type === CellType.Intersection && cell.location === Location.Inner) {
            const connectedPositions: [Position, Position] = (this.isEven(x) ? [{ x: x - 1, y: y }, { x: x + 1, y: y }] : [{ x: x, y: y - 1 }, { x: x, y: y + 1 }]);

            return cells.filter(cell => positionsAreSame(cell.position, connectedPositions[0]) ||
                positionsAreSame(cell.position, connectedPositions[1]));
        }
        throw new Error("getConnectedCells() is not implemented for this cell type");
    }

    private generateMaze(cols: number, rows: number, cells: Cell[]): void {
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

export interface Maze2d extends GameObject{
    getClosestCell(position: Position, blockType: BlockType): Cell;

    isBlockType(position: Position, blockType: BlockType): boolean;

    get startPosition(): Position;
}

class Maze2dImpl implements Maze2d {
    private readonly cells: Cell[];
    private readonly cols: number;
    public status: Status;
    private readonly tileSize: number;

    constructor(cells: Cell[], cols: number, status: Status, tileSize: number) {
        this.cells = cells;
        this.cols = cols;
        this.status = status;
        this.tileSize = tileSize;
    }

    public isBlockType(position: Position, blockType: BlockType): boolean {
        const normalizedPosition: Position = { x: Math.floor(position.x / this.tileSize), y: Math.floor(position.y / this.tileSize) };
        const cell = this.cells.find(cell => cell.position.x === normalizedPosition.x && cell.position.y === normalizedPosition.y);
        return cell!.blockType === blockType;
    }

    public getClosestCell(position: Position, blockType: BlockType): Cell {
        const cells = this.cells.filter(cell => cell.blockType === blockType);

        let closestPathCell: Cell | null = null;
        let closestDistance = Number.MAX_SAFE_INTEGER;

        for (const cell of cells) {
            const distance = Math.sqrt(
                Math.pow(cell.position.x - position.x!, 2) +
                Math.pow(cell.position.y - position.y!, 2)
            );

            if (distance < closestDistance) {
                closestPathCell = cell;
                closestDistance = distance;
            }
        }

        return closestPathCell!;
    }

    update(): void {

    }
    render(canvas: HTMLCanvasElement): void {
        const context = canvas.getContext('2d')!;
        context.strokeRect(0, 0, canvas.width, canvas.height);
        const tileSize = canvas.width / this.cols;
        const grid = this.cells;
        grid.forEach((cell) => {
            switch (cell.blockType) {
                case BlockType.Wall:
                    context.fillStyle = 'black';
                    break;
                case BlockType.Path:
                    context.fillStyle = 'white';
                    break;
                case BlockType.Start:
                    context.fillStyle = 'green';
                    break;
                default:
                    throw new Error(`BlockType in cell not implemented: ${cell.blockType}`);
            }

            const x = cell.position.x;
            const y = cell.position.y;
            context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        });
    }

    get startPosition(): Position {
        return this.cells.find((cell) => cell.blockType === BlockType.Start)!.position;
    }
}