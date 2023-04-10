import { Grid2d } from '../../../../../src/ts/maze/src/grid2d';
import { Maze2d } from '../../../../../src/ts/maze/src/maze2d';
import { MazeAlgo } from '../../../../../src/ts/maze/src/mazeAlgo';

describe("Maze2d", () => {
    it("should not have a grid with only zeroes after instantiation", () => {
      const grid = new Grid2d(5, 5);
      const maze = new Maze2d(grid, new MazeAlgo());
  
      expect(maze.getAllValues()).not.toEqual(Array.from({length: 25}, () => 0));
    });
  });
  