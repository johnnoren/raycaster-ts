import { Array2dBuilder } from '../src/ts/array2dBuilder';

describe('Array2dBuilder', () => {
    it('should create a 2D array of the correct size', () => {
      const builder = new Array2dBuilder(3, 4);
      const result = builder.build();
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveLength(4);
    });
  });
  
  describe('Array2dBuilder', () => {
    describe('build', () => {
      it('should initialize entire 2D array with specified value', () => {
        const rows = 3;
        const cols = 3;
        const value = 1;
        const builder = new Array2dBuilder<number>(rows, cols);
        const expectedArray = [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ];
        const actualArray = builder.fill(value).build();
        expect(actualArray).toEqual(expectedArray);
      });
    });
  });
  