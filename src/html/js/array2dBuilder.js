export class Array2dBuilder {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.array = [];
        for (let i = 0; i < rows; i++) {
            this.array[i] = new Array(cols);
        }
    }
    fill(value) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.array[i][j] = value;
            }
        }
        return this;
    }
    build() {
        return this.array;
    }
}
