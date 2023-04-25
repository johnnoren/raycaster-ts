import { GameObject, Status } from "../gameObject.js";
import { CanvasId } from "../game.js";
import { Vector2 } from "../math/vector2.js";

export enum CellType {
    Intersection,
    Regular,
    Static,
}

export enum Location {
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
    position: Vector2;
}

export class Map2 implements GameObject {
    private readonly cells: Cell[];
    public readonly cols: number;
    public readonly rows: number;
    public status: Status;

    constructor(cells: Cell[], cols: number, rows: number, status: Status) {
        this.cells = cells;
        this.cols = cols;
        this.rows = rows;
        this.status = status;
    }

    public isBlockType(position: Vector2, blockType: BlockType): boolean {
        const flooredPosition = position.floored();
        const cell = this.cells.find(cell => cell.position.equals(flooredPosition));

        return cell!.blockType === blockType;
    }

    public getClosestCellPosition(position: Vector2, blockType: BlockType): Vector2 {
        const cells = this.cells.filter(cell => cell.blockType === blockType);

        let closestCellPosition: Vector2 = position;
        let closestDistance = Number.MAX_SAFE_INTEGER;

        for (const cell of cells) {
            const difference = cell.position.subtract(position);
            const distance = difference.magnitude;
            
            if (distance < closestDistance) {
                closestCellPosition = cell.position;
                closestDistance = distance;
            }
        }

        return closestCellPosition;
    }

    update(): void {

    }
    render(canvases: HTMLCanvasElement[]): void {
        canvases.forEach((canvas) => {
            switch (canvas.id) {
                case CanvasId.map:
                    this.renderMap(canvas);
                    break;
                case CanvasId.fov:
                    
                    break;
                default: throw new Error("CanvasId not implemented: " + canvas.id);
            }
        });
    }

    private renderMap(canvas: HTMLCanvasElement) {
        const context = canvas.getContext('2d')!;
        context.strokeRect(0, 0, canvas.width, canvas.height);
        const tileSize = canvas.width / this.cols;
        this.cells.forEach((cell) => {
            switch (cell.blockType) {
                case BlockType.Wall:
                    context.fillStyle = 'black';
                    context.fillRect(cell.position.x * tileSize, cell.position.y * tileSize, tileSize, tileSize);
                    break;
                case BlockType.Path:
                    //context.fillStyle = 'white';
                    break;
                case BlockType.Start:
                    //context.fillStyle = 'green';
                    break;
                default:
                    throw new Error(`BlockType in cell not implemented: ${cell.blockType}`);
            }

            
        });
    }

    get startPosition(): Vector2 {
        return this.cells.find((cell) => cell.blockType === BlockType.Start)!.position;
    }
}