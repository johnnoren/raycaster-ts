export interface Grid2d<T> {
    readonly rows: number;
    readonly cols: number;
    readonly array: T[][];
    
    toArray(): T[][];
  
    map<U>(callback: (tile: T, x: number, y: number) => U): Grid2d<U>;
  
    forEach(callback: (tile: T, x: number, y: number) => void): void;
  
    forEachInArea(fromX: number, fromY: number, toX: number, toY: number, callback: (array: T[][], x: number, y: number) => void): void;
  
    forEachInRow(row: number, callback: (tile: T, x: number, y: number) => void): void;
  
    forEachInCol(col: number, callback: (tile: T, x: number, y: number) => void): void;
  
    fill(value: T): void;
  
    get(x: number, y: number): T;
  
    set(x: number, y: number, value: T): void;
  }
  