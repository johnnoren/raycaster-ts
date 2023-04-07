import { MazeBuilder } from '../src/ts/mazeBuilder';

describe('MazeBuilder', () => {
  const rows = 10;
  const cols = 10;

  it('carves a maze with the correct dimensions', () => {
    const array = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
    const mazeBuilder = new MazeBuilder(array);
    const carvedMaze = mazeBuilder.carveMaze();

    expect(carvedMaze).toHaveLength(rows);
    expect(carvedMaze[0]).toHaveLength(cols);
  });

  it('carves a non-empty maze', () => {
    const array = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
    const mazeBuilder = new MazeBuilder(array);
    const carvedMaze = mazeBuilder.carveMaze();

    const mazeIsEmpty = carvedMaze.every((row) => row.every((cell) => cell === 0));
    expect(mazeIsEmpty).toBeFalsy();
  });
});
