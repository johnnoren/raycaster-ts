export class Array2dBuilder<T> {
    private rows: number;
    private cols: number;
    private array: T[][];
  
    constructor(rows: number, cols: number) {
      this.rows = rows;
      this.cols = cols;
      this.array = [];
      for (let i = 0; i < rows; i++) {
        this.array[i] = new Array(cols);
      }
    }
  
    fill(value: T): Array2dBuilder<T> {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.array[i]![j] = value;
        }
      }
      return this;
    }
  
    build(): T[][] {
      return this.array;
    }
  }
  