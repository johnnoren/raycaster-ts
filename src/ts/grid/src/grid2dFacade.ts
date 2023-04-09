import { Grid2d } from './grid2d.js';
import { Grid2dImpl } from './grid2dImpl.js';

export class Grid2dFacade {

    getGrid2d<T>(cols: number, rows: number, initialValue: () => T): Grid2d<T> {
        return Grid2dImpl.create(cols, rows, initialValue);
    }

    getGrid2dFromArray<T>(array: T[][]): Grid2d<T> {
        return Grid2dImpl.fromArray(array);
    }

}