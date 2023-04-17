import { Dda, Position, Vector2 } from '../../../src/ts/dda';

describe('Dda', () => {
  let dda: Dda;

  beforeEach(() => {
    dda = new Dda();
  });

  test('getDistanceToCellType should return the correct distance to the nearest wanted cell type', () => {
    const startPosition: Position = { x: 1.5, y: 1.5 };
    const direction: Vector2 = { x: 1, y: 0 };

    const gridWidth = 5;
    const gridHeight = 5;
    const maxLength = Math.max(gridWidth, gridHeight);

    const isWantedCellType = (position: Position) => {
      // Check if the position is within the grid boundaries
      if (position.x < 0 || position.x >= gridWidth || position.y < 0 || position.y >= gridHeight) {
        return false;
      }

      // Return true if the position's x is 3 and y is 1
      return position.x === 3 && position.y === 1;
    };

    const result = dda.getDistanceToCellType(startPosition, direction, isWantedCellType, maxLength);

    expect(result).toBeCloseTo(1.5); // Expecting the distance to be 1.5
  });

  // Add more test cases for different scenarios
});

