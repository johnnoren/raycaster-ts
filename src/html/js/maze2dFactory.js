import { CanvasId } from "./game.js";
import { Status } from "./gameObject.js";
var CellType;
(function (CellType) {
    CellType[CellType["Intersection"] = 0] = "Intersection";
    CellType[CellType["Regular"] = 1] = "Regular";
    CellType[CellType["Static"] = 2] = "Static";
})(CellType || (CellType = {}));
var Location;
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
export class Maze2dFactory {
    constructor() {
        this.isEven = (n) => { return n % 2 === 0; };
        this.isOdd = (n) => { return n % 2 === 1; };
    }
    createMaze(cols, rows, tileSize) {
        if (rows < 3 || cols < 3) {
            throw new Error("The maze must have at least 3 rows and 3 cols");
        }
        if (this.isEven(rows) || this.isEven(cols)) {
            throw new Error("The maze must have an odd number of rows and cols");
        }
        const cells = [];
        this.initializeCells(cols, rows, cells);
        this.generateMaze(cols, rows, cells);
        return new Maze2dImpl(cells, cols, rows, Status.Active);
    }
    initializeCells(cols, rows, cells) {
        let counter = 0;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const cell = {
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
    getCellType({ x, y }) {
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
    getLocation({ x, y }, cols, rows) {
        const isPartOfPerimeter = y === 0 || y === rows - 1 || x === 0 || x === cols - 1;
        return isPartOfPerimeter ? Location.Perimeter : Location.Inner;
    }
    getConnectedCells(cell, cells) {
        const x = cell.position.x;
        const y = cell.position.y;
        const positionsAreSame = (position1, position2) => {
            return position1.x === position2.x && position1.y === position2.y;
        };
        if (cell.type === CellType.Intersection && cell.location === Location.Inner) {
            const connectedPositions = (this.isEven(x) ? [{ x: x - 1, y: y }, { x: x + 1, y: y }] : [{ x: x, y: y - 1 }, { x: x, y: y + 1 }]);
            return cells.filter(cell => positionsAreSame(cell.position, connectedPositions[0]) ||
                positionsAreSame(cell.position, connectedPositions[1]));
        }
        throw new Error("getConnectedCells() is not implemented for this cell type");
    }
    generateMaze(cols, rows, cells) {
        const innerIntersectionCells = cells.filter(cell => cell.location === Location.Inner && cell.type === CellType.Intersection);
        const shuffledInnerIntersectionCells = this.shuffleArray(innerIntersectionCells);
        shuffledInnerIntersectionCells.forEach(interSectionCell => {
            const connectedCells = this.getConnectedCells(interSectionCell, cells);
            const lowestGroupValue = Math.min(connectedCells[0].group, connectedCells[1].group);
            const highestGroupValue = Math.max(connectedCells[0].group, connectedCells[1].group);
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
    addExit(cells) {
        const perimeterIntersectionCells = cells.filter(cell => cell.location === Location.Perimeter && cell.type === CellType.Intersection);
        const exitCell = this.shuffleArray(perimeterIntersectionCells)[0];
        exitCell.blockType = BlockType.Path;
    }
    shuffleArray(array) {
        function randomSort(_a, _b) {
            return Math.random() < 0.5 ? -1 : 1;
        }
        array.sort(randomSort);
        return array;
    }
}
class Maze2dImpl {
    constructor(cells, cols, rows, status) {
        this.cells = cells;
        this.cols = cols;
        this.status = status;
    }
    isBlockType(position, blockType) {
        const normalizedPosition = { x: Math.floor(position.x), y: Math.floor(position.y) };
        const cell = this.cells.find(cell => cell.position.x === normalizedPosition.x && cell.position.y === normalizedPosition.y);
        return cell.blockType === blockType;
    }
    isWall(position) {
        return this.isBlockType(position, BlockType.Wall);
    }
    getClosestCell(position, blockType) {
        const cells = this.cells.filter(cell => cell.blockType === blockType);
        let closestPathCell = null;
        let closestDistance = Number.MAX_SAFE_INTEGER;
        for (const cell of cells) {
            const distance = Math.sqrt(Math.pow(cell.position.x - position.x, 2) +
                Math.pow(cell.position.y - position.y, 2));
            if (distance < closestDistance) {
                closestPathCell = cell;
                closestDistance = distance;
            }
        }
        return closestPathCell;
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
            context.fillRect(cell.position.x * tileSize, cell.position.y * tileSize, tileSize, tileSize);
        });
    }
    get startPosition() {
        return this.cells.find((cell) => cell.blockType === BlockType.Start).position;
    }
}
