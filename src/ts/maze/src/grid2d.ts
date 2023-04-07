export class Grid2d<T> {
    public readonly rows: number;
    public readonly cols: number;
    private array: T[][];

    constructor(cols: number, rows: number, defaultValue: () => T) {
        this.cols = cols;
        this.rows = rows;
        this.array = [];
        for (let i = 0; i < cols; i++) {
            this.array[i] = new Array(rows);
            for (let j = 0; j < rows; j++) {
                this.array[i]![j] = defaultValue();
            }
        }
    }

    forEach(callback: (tile: T, x: number, y: number) => void) {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                callback(this.array[i]![j]!, i, j);
            }
        }
    }

    forEachInArea(fromX: number, fromY: number, toX: number, toY: number, callback: (tile: T, x: number, y: number) => void) {
        for (let i = fromX; i <= toX; i++) {
            for (let j = fromY; j <= toY; j++) {
                callback(this.array[i]![j]!, i, j);
            }
        }
    }

    forEachInRow(row: number, callback: (tile: T, x: number, y: number) => void) {
        for (let i = 0; i < this.cols; i++) {
            callback(this.array[i]![row]!, i, row);
        }
    }

    forEachInCol(col: number, callback: (tile: T, x: number, y: number) => void) {
        for (let i = 0; i < this.rows; i++) {
            callback(this.array[col]![i]!, col, i);
        }
    }

    fill(value: T) {
        this.forEach((tile, _x, _y) => {
            tile = value;
        });
    }

    get(x: number, y: number): T {
        return this.array[x]![y]!;
    }

    set(x: number, y: number, value: T) {
        this.array[x]![y] = value;
    }

}