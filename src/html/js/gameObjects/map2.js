import { CanvasId } from "../game.js";
export var CellType;
(function (CellType) {
    CellType[CellType["Intersection"] = 0] = "Intersection";
    CellType[CellType["Regular"] = 1] = "Regular";
    CellType[CellType["Static"] = 2] = "Static";
})(CellType || (CellType = {}));
export var Location;
(function (Location) {
    Location[Location["Perimeter"] = 0] = "Perimeter";
    Location[Location["Inner"] = 1] = "Inner";
})(Location || (Location = {}));
export var BlockType;
(function (BlockType) {
    BlockType[BlockType["Wall"] = 0] = "Wall";
    BlockType[BlockType["Path"] = 1] = "Path";
    BlockType[BlockType["Start"] = 2] = "Start";
})(BlockType || (BlockType = {}));
export class Map2 {
    constructor(cells, cols, rows, status) {
        this.cells = cells;
        this.cols = cols;
        this.rows = rows;
        this.status = status;
    }
    isBlockType(position, blockType) {
        const flooredPosition = position.floored();
        const cell = this.cells.find(cell => cell.position.equals(flooredPosition));
        return cell.blockType === blockType;
    }
    getClosestCellPosition(position, blockType) {
        const cells = this.cells.filter(cell => cell.blockType === blockType);
        let closestCellPosition = position;
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
    update() {
    }
    render(canvases) {
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
    renderMap(canvas) {
        const context = canvas.getContext('2d');
        context.strokeRect(0, 0, canvas.width, canvas.height);
        const tileSize = canvas.width / this.cols;
        this.cells.forEach((cell) => {
            switch (cell.blockType) {
                case BlockType.Wall:
                    context.fillStyle = 'black';
                    context.fillRect(cell.position.x * tileSize, cell.position.y * tileSize, tileSize, tileSize);
                    break;
                case BlockType.Path:
                    break;
                case BlockType.Start:
                    break;
                default:
                    throw new Error(`BlockType in cell not implemented: ${cell.blockType}`);
            }
        });
    }
    get startPosition() {
        return this.cells.find((cell) => cell.blockType === BlockType.Start).position;
    }
}
