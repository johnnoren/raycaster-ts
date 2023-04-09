import { Grid2d } from "./grid2d.js";

export class Grid2dImpl<T> implements Grid2d<T>{
    public readonly rows: number;
    public readonly cols: number;
    public readonly array: T[][];

    private constructor(cols: number, rows: number, initialValue: () => T) {
        this.cols = cols;
        this.rows = rows;
        this.array = [];
        for (let i = 0; i < cols; i++) {
            this.array[i] = new Array(rows);
            for (let j = 0; j < rows; j++) {
                this.array[i]![j] = initialValue();
            }
        }
    }

    static create<T>(cols: number, rows: number, initialValue: () => T): Grid2d<T> {
        return new Grid2dImpl<T>(cols, rows, initialValue);
    }

    static fromArray<T>(array: T[][]): Grid2d<T> {
        const cols = array.length;
        const rows = array[0]!.length;
        const grid = new Grid2dImpl<T>(cols, rows, () => {
            return {} as T;
        });
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid.array[i]![j] = array[i]![j] as T;
            }
        }
        return grid;
    }

    toArray(): T[][] {
        return this.array;
    }

    map<U>(callback: (tile: T, x: number, y: number) => U): Grid2d<U> {
        const grid = new Grid2dImpl<U>(this.cols, this.rows, () => {
            return {} as U;
        });
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                grid.array[i]![j] = callback(this.array[i]![j]!, i, j);
            }
        }
        return grid;
    }

    forEach(callback: (tile: T, x: number, y: number) => void) {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                callback(this.array[i]![j]!, i, j);
            }
        }
    }

    forEachInArea(fromX: number, fromY: number, toX: number, toY: number, callback: (array: T[][], x: number, y: number) => void) {
        for (let i = fromX - 1; i < toX; i++) {
            for (let j = fromY - 1; j < toY; j++) {
                callback(this.array, i, j);
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