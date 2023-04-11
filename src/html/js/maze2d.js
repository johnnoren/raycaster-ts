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
export class Maze2d {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.isEven = (n) => { return n % 2 === 0; };
        this.isOdd = (n) => { return n % 2 === 1; };
        this.cells = [];
        if (rows < 3 || cols < 3) {
            throw new Error("The maze must have at least 3 rows and 3 cols");
        }
        if (this.isEven(rows) || this.isEven(cols)) {
            throw new Error("The maze must have an odd number of rows and cols");
        }
        this.initializeCells(cols, rows);
        this.generateMaze();
    }
    initializeCells(cols, rows) {
        let counter = 0;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const cell = {
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
    getCellType([x, y]) {
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
    getLocation([x, y]) {
        const isPartOfPerimeter = y === 0 || y === this.rows - 1 || x === 0 || x === this.cols - 1;
        return isPartOfPerimeter ? Location.Perimeter : Location.Inner;
    }
    getConnectedCells(cell) {
        const x = cell.position[0];
        const y = cell.position[1];
        const positionsAreSame = (position1, position2) => {
            return position1[0] === position2[0] && position1[1] === position2[1];
        };
        if (cell.type === CellType.Intersection && cell.location === Location.Inner) {
            const connectedPositions = (this.isEven(x) ? [[x - 1, y], [x + 1, y]] : [[x, y - 1], [x, y + 1]]);
            return this.cells.filter(cell => positionsAreSame(cell.position, connectedPositions[0]) ||
                positionsAreSame(cell.position, connectedPositions[1]));
        }
        throw new Error("getConnectedCells() is not implemented for this cell type");
    }
    generateMaze() {
        const innerIntersectionCells = this.cells.filter(cell => cell.location === Location.Inner && cell.type === CellType.Intersection);
        const shuffledInnerIntersectionCells = this.shuffleArray(innerIntersectionCells);
        shuffledInnerIntersectionCells.forEach(interSectionCell => {
            const connectedCells = this.getConnectedCells(interSectionCell);
            const lowestGroupValue = Math.min(connectedCells[0].group, connectedCells[1].group);
            const highestGroupValue = Math.max(connectedCells[0].group, connectedCells[1].group);
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
        this.addStartPosition();
    }
    addStartPosition() {
        const pathCells = this.cells.filter(cell => cell.blockType === BlockType.Path);
        const middleCellPosition = [Math.floor(this.cols / 2), Math.floor(this.rows / 2)];
        let closestPathCell = null;
        let closestDistance = Number.MAX_SAFE_INTEGER;
        for (const cell of pathCells) {
            const distance = Math.sqrt(Math.pow(cell.position[0] - middleCellPosition[0], 2) +
                Math.pow(cell.position[1] - middleCellPosition[1], 2));
            if (distance < closestDistance) {
                closestPathCell = cell;
                closestDistance = distance;
            }
        }
        if (closestPathCell) {
            closestPathCell.blockType = BlockType.Start;
        }
    }
    addExit() {
        const perimeterIntersectionCells = this.cells.filter(cell => cell.location === Location.Perimeter && cell.type === CellType.Intersection);
        const shuffledPerimeterIntersectionCells = this.shuffleArray(perimeterIntersectionCells);
        const exitCell = shuffledPerimeterIntersectionCells[0];
        exitCell.blockType = BlockType.Path;
    }
    shuffleArray(array) {
        function randomSort(_a, _b) {
            return Math.random() < 0.5 ? -1 : 1;
        }
        array.sort(randomSort);
        return array;
    }
    get startPosition() {
        return this.cells.find((cell) => cell.blockType === BlockType.Start).position;
    }
}
