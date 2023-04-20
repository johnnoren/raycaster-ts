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

    const isWantedCellType = (position: Position) => {
      if (position.x < 0 || position.x >= gridWidth || position.y < 0 || position.y >= gridHeight) {
        return false;
      }

      return position.x === 3 && position.y === 1;
    };

    const result = dda.getDistanceToCellType(startPosition, direction, isWantedCellType, gridWidth, gridHeight);

    expect(result).toBeCloseTo(1.5);
  });

  test('getDistanceToCellType should return the correct distance with a different direction vector', () => {
    const startPosition: Position = { x: 1.5, y: 1.5 };
    const direction: Vector2 = { x: 0, y: 1 };
  
    const gridWidth = 5;
    const gridHeight = 5;
  
    const isWantedCellType = (position: Position) => {
      if (position.x < 0 || position.x >= gridWidth || position.y < 0 || position.y >= gridHeight) {
        return false;
      }
  
      return position.x === 1 && position.y === 3;
    };
  
    const result = dda.getDistanceToCellType(startPosition, direction, isWantedCellType, gridWidth, gridHeight);
  
    expect(result).toBeCloseTo(1.5);
  });

  test('getDistanceToCellType should return the correct distance with a negative y direction vector', () => {
    const startPosition: Position = { x: 1.5, y: 1.5 };
    const direction: Vector2 = { x: 0, y: -1 };
  
    const gridWidth = 5;
    const gridHeight = 5;
  
    const isWantedCellType = (position: Position) => {
      if (position.x < 0 || position.x >= gridWidth || position.y < 0 || position.y >= gridHeight) {
        return false;
      }
  
      return position.x === 1 && position.y === 0;
    };
  
    const result = dda.getDistanceToCellType(startPosition, direction, isWantedCellType, gridWidth, gridHeight);
  
    expect(result).toBeCloseTo(0.5);
  });

  test('getDistanceToCellType should return the correct distance when there is no matching cell type', () => {
    const startPosition: Position = { x: 1.5, y: 1.5 };
    const direction: Vector2 = { x: -1, y: 0 };
  
    const gridWidth = 5;
    const gridHeight = 5;
  
    const isWantedCellType = (_position: Position) => false;
  
    const result = dda.getDistanceToCellType(startPosition, direction, isWantedCellType, gridWidth, gridHeight);
  
    expect(result).toBe(1.5);
  });
  
    test('getInitialStepLength returns correct values for positive direction', () => {
      const startPosition: Position = { x: 2.3, y: 3.7 };
      const direction: Vector2 = { x: 1, y: 1 };
  
      const result = dda.getInitialStepLength(startPosition, direction);
  
      expect(result.dx).toBeCloseTo(0.7, 5);
      expect(result.dy).toBeCloseTo(0.3, 5);
    });
  
    test('getInitialStepLength returns correct values for negative direction', () => {
      const startPosition: Position = { x: 2.3, y: 3.7 };
      const direction: Vector2 = { x: -1, y: -1 };
  
      const result = dda.getInitialStepLength(startPosition, direction);
  
      expect(result.dx).toBeCloseTo(0.3, 5);
      expect(result.dy).toBeCloseTo(0.7, 5);
    });
  
    test('getInitialStepLength returns correct values for mixed direction', () => {
      const startPosition: Position = { x: 2.3, y: 3.7 };
      const direction: Vector2 = { x: 1, y: -1 };
  
      const result = dda.getInitialStepLength(startPosition, direction);
  
      expect(result.dx).toBeCloseTo(0.7, 5);
      expect(result.dy).toBeCloseTo(0.7, 5);
    });
  
    test('getScalingFactors returns correct values for 45-degree direction', () => {
      const direction: Vector2 = { x: 1, y: 1 };
  
      const result = dda.getScalingFactors(direction);
  
      expect(result.sx).toBeCloseTo(2, 5);
      expect(result.sy).toBeCloseTo(2, 5);
    });
  
    test('getScalingFactors returns correct values for 30-degree direction', () => {
      const direction: Vector2 = { x: Math.sqrt(3), y: 1 };
  
      const result = dda.getScalingFactors(direction);
  
      expect(result.sx).toBeCloseTo(1 + 1 / Math.sqrt(3), 5);
      expect(result.sy).toBeCloseTo(1 + Math.sqrt(3), 5);
    });
  
    test('getScalingFactors returns correct values for negative direction', () => {
      const direction: Vector2 = { x: -2, y: -1 };
  
      const result = dda.getScalingFactors(direction);
  
      expect(result.sx).toBeCloseTo(1.5, 5);
      expect(result.sy).toBeCloseTo(3, 5);
    });
  
    test('getScalingFactors returns correct values for mixed direction', () => {
      const direction: Vector2 = { x: 2, y: -3 };
  
      const result = dda.getScalingFactors(direction);
  
      expect(result.sx).toBeCloseTo(2.5, 5);
      expect(result.sy).toBeCloseTo(1.6666666667, 5);
    });
  
    test('getNextCellPosition returns correct position for positive direction and xLineLength < yLineLength', () => {
      const currentCellPosition: Position = { x: 2, y: 3 };
      const xLineLength = 0.5;
      const yLineLength = 0.8;
      const direction: Vector2 = { x: 1, y: 1 };
  
      const result = dda.getNextCellPosition(currentCellPosition, xLineLength, yLineLength, direction);
  
      expect(result).toEqual({ x: 3, y: 3 });
    });
  
    test('getNextCellPosition returns correct position for positive direction and xLineLength >= yLineLength', () => {
      const currentCellPosition: Position = { x: 2, y: 3 };
      const xLineLength = 0.8;
      const yLineLength = 0.5;
      const direction: Vector2 = { x: 1, y: 1 };
  
      const result = dda.getNextCellPosition(currentCellPosition, xLineLength, yLineLength, direction);
  
      expect(result).toEqual({ x: 2, y: 4 });
    });
  
    test('getNextCellPosition returns correct position for negative direction and xLineLength < yLineLength', () => {
      const currentCellPosition: Position = { x: 2, y: 3 };
      const xLineLength = 0.5;
      const yLineLength = 0.8;
      const direction: Vector2 = { x: -1, y: -1 };
  
      const result = dda.getNextCellPosition(currentCellPosition, xLineLength, yLineLength, direction);
  
      expect(result).toEqual({ x: 1, y: 3 });
    });
  
    test('getNextCellPosition returns correct position for negative direction and xLineLength >= yLineLength', () => {
      const currentCellPosition: Position = { x: 2, y: 3 };
      const xLineLength = 0.8;
      const yLineLength = 0.5;
      const direction: Vector2 = { x: -1, y: -1 };
  
      const result = dda.getNextCellPosition(currentCellPosition, xLineLength, yLineLength, direction);
  
      expect(result).toEqual({ x: 2, y: 2 });
    });
  
});

