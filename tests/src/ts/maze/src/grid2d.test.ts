import { Grid2d, Position } from '../../../../../src/ts/maze/src/grid2d';

describe("Grid2d.forEach", () => {
    it("should call the callback function for each element in the grid", () => {
        const grid = new Grid2d(3, 3);
        const spy = jest.fn();

        grid.forEach(spy);

        expect(spy).toHaveBeenCalledTimes(9);
    });

    it("should pass the value, x coordinate, and y coordinate to the callback function", () => {
        const grid = new Grid2d(3, 3);
        const spy = jest.fn();

        grid.forEach(spy);

        expect(spy.mock.calls[0][0]).toBe(1);
        expect(spy.mock.calls[0][1]).toBe(0);
        expect(spy.mock.calls[0][2]).toBe(0);

        expect(spy.mock.calls[8][0]).toBe(1);
        expect(spy.mock.calls[8][1]).toBe(2);
        expect(spy.mock.calls[8][2]).toBe(2);
    });
});

describe("Grid2d.isPerimeterIntersectionCell", () => {
    it("should return true if the cell is on the perimeter of the grid and has odd x and y coordinates", () => {
        const grid = new Grid2d(3, 3);
        const leftPerimeter = 0;
        const rightPerimeter = 2;
        const topPerimeter = 0;
        const bottomPerimeter = 2;
        expect(grid.isPerimeterIntersectionCell([1, topPerimeter])).toBe(true);
        expect(grid.isPerimeterIntersectionCell([1, bottomPerimeter])).toBe(true);
        expect(grid.isPerimeterIntersectionCell([leftPerimeter, 1])).toBe(true);
        expect(grid.isPerimeterIntersectionCell([rightPerimeter, 1])).toBe(true);

        expect(grid.isPerimeterIntersectionCell([0, topPerimeter])).toBe(false);
        expect(grid.isPerimeterIntersectionCell([0, bottomPerimeter])).toBe(false);
        expect(grid.isPerimeterIntersectionCell([leftPerimeter, 0])).toBe(false);
        expect(grid.isPerimeterIntersectionCell([rightPerimeter, 0])).toBe(false);

        expect(grid.isPerimeterIntersectionCell([1, 1])).toBe(false);
    });
});

describe("Grid2d.isInnerCell", () => {
    it("should return true if the cell is an inner cell", () => {
        const grid = new Grid2d(5, 5);
        expect(grid.isInnerCell([1, 1])).toBe(true);
        expect(grid.isInnerCell([1, 3])).toBe(true);
        expect(grid.isInnerCell([3, 1])).toBe(true);
        expect(grid.isInnerCell([3, 3])).toBe(true);
    });

    it("should return false if the cell is on the perimeter of the grid", () => {
        const grid = new Grid2d(5, 5);
        expect(grid.isInnerCell([2, 0])).toBe(false);
        expect(grid.isInnerCell([2, 4])).toBe(false);
        expect(grid.isInnerCell([0, 2])).toBe(false);
        expect(grid.isInnerCell([4, 2])).toBe(false);
    });
});

describe("Grid2d.isInnerIntersectionCell", () => {
    it("should return true if the cell is an inner intersection cell", () => {
        const grid = new Grid2d(5, 5);
        expect(grid.isInnerIntersectionCell([1, 2])).toBe(true);
        expect(grid.isInnerIntersectionCell([2, 1])).toBe(true);
        expect(grid.isInnerIntersectionCell([2, 3])).toBe(true);
        expect(grid.isInnerIntersectionCell([3, 2])).toBe(true);
    });

    it("should return false if the cell is not an inner intersection cell", () => {
        const grid = new Grid2d(5, 5);
        expect(grid.isInnerIntersectionCell([1, 1])).toBe(false);
        expect(grid.isInnerIntersectionCell([1, 3])).toBe(false);
        expect(grid.isInnerIntersectionCell([3, 1])).toBe(false);
        expect(grid.isInnerIntersectionCell([3, 3])).toBe(false);
    });
});

describe("Grid2d.getPositions", () => {
    it("should return an array of positions that match all of the provided predicates", () => {
        const grid = new Grid2d(5, 5);
        const isOdd = ([x, y]: Position) => (x % 2 === 1 && y % 2 === 1);
        const containsOneOrThree = ([x, y]: Position) => (x === 1 || x === 3 || y === 1 || y === 3);
        const result = grid.getPositions(containsOneOrThree, isOdd);

        expect(result).toHaveLength(4);
        expect(result).toContainEqual([1, 1]);
        expect(result).toContainEqual([1, 3]);
        expect(result).toContainEqual([3, 1]);
        expect(result).toContainEqual([3, 3]);
    });

    it("should return an empty array if no positions match all of the provided predicates", () => {
        const grid = new Grid2d(5, 5);
        const isOutsideOfGrid = ([x, y]: Position) => (x < 0 || x > 4 || y < 0 || y > 4);
        const containsOneOrThree = ([x, y]: Position) => (x === 1 || x === 3 || y === 1 || y === 3);
        const result = grid.getPositions(containsOneOrThree, isOutsideOfGrid);

        expect(result).toHaveLength(0);
    });
});

describe("Grid2d.fillWithSequentialNumbers", () => {
    it("should fill the specified positions with sequential numbers", () => {
        const grid = new Grid2d(5, 5);
        const positions: Position[] = [[1, 1], [1, 3], [3, 1], [3, 3]];
        grid.fillWithSequentialNumbers(positions);

        expect(grid.getValue([1, 1])).toBe(0);
        expect(grid.getValue([1, 3])).toBe(1);
        expect(grid.getValue([3, 1])).toBe(2);
        expect(grid.getValue([3, 3])).toBe(3);

    });
});

describe("Grid2d.getConnectedCellValues", () => {
    it("should return an array of values for cells connected to an intersection cell", () => {
        const grid = new Grid2d(5, 5);
        grid.fillWithSequentialNumbers([[1, 1], [1, 3], [3, 1], [3, 3]]);
        expect(grid.getConnectedCellValues([2, 2])).toHaveLength(0);
        expect(grid.getConnectedCellValues([2, 3])).toEqual(expect.arrayContaining([1, 3]));
        expect(grid.getConnectedCellValues([1, 2])).toEqual(expect.arrayContaining([0, 1]));
    });
});

describe("Grid2d.getInnerCellPositions", () => {
    it("should return an array of positions for inner cells", () => {
      const grid = new Grid2d(5, 5);
      const result = grid.getInnerCellPositions();

      expect(result).toHaveLength(4);
      expect(result).toContainEqual([1, 1]);
      expect(result).toContainEqual([1, 3]);
      expect(result).toContainEqual([3, 1]);
      expect(result).toContainEqual([3, 3]);
    });
  });

  describe("Grid2d.getInnerIntersectionCellPositions", () => {
    it("should return an array of positions for inner intersection cells", () => {
      const grid = new Grid2d(5, 5);
      const result = grid.getInnerIntersectionCellPositions();
  
      expect(result).toHaveLength(4);
      expect(result).toContainEqual([1, 2]);
      expect(result).toContainEqual([2, 1]);
      expect(result).toContainEqual([2, 3]);
      expect(result).toContainEqual([3, 2]);
    });
  });

  describe("Grid2d.getCellsByValue", () => {
    it("should return an array of positions for cells with the given value", () => {
      const grid = new Grid2d(5, 5);
      grid.setCellsToValue([[1, 1], [1, 3], [3, 1], [3, 3]], 2);
      const result = grid.getCellsByValue(2);
  
      expect(result).toHaveLength(4);
      expect(result).toContainEqual([1, 1]);
      expect(result).toContainEqual([1, 3]);
      expect(result).toContainEqual([3, 1]);
      expect(result).toContainEqual([3, 3]);
    });
  });

  describe("Grid2d.setCellsToValue", () => {
    it("should set the specified cells to the given value", () => {
      const grid = new Grid2d(5, 5);
      const positions: Position[] = [[2, 2], [2, 4], [4, 2], [4, 4]];
      grid.setCellsToValue(positions, 10);
  
      positions.forEach(position => {
        expect(grid.getValue(position)).toBe(10);
      });
    });
  });
  
  describe("Grid2d.addExit", () => {
    it("should set one perimeter intersection cell to path", () => {
      const grid = new Grid2d(5, 5);
      const perimeterIntersectionCells = grid.getPerimeterIntersectionCellPositions();
      const beforeAddExit = perimeterIntersectionCells.map(position => grid.getValue(position));
      grid.addExit();
      const afterAddExit = perimeterIntersectionCells.map(position => grid.getValue(position));
  
      expect(beforeAddExit).not.toContain(0);
      expect(afterAddExit).toContain(0);
      expect(beforeAddExit).not.toEqual(afterAddExit);
      expect(afterAddExit.filter(value => value === 0)).toHaveLength(1);
    });
  });
  
  describe("Grid2d.constructor", () => {
    it("should initialize grid to 1 (wall)", () => {
      const grid = new Grid2d(5, 5);
      const result = grid.getAllValues();
  
      expect(result.filter(value => value === 1)).toHaveLength(25);
    });
  });