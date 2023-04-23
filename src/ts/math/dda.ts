import { Direction } from "./direction.js";
import { Vector2 } from "./vector2.js";
export type Position = { x: number; y: number };

/**
 * Calculates the shortest distance in a certain direction to a specified cell type in a grid using the digital differential analyzer (DDA) algorithm.
 */
export class Dda {

    public getInitialStepLength(startPosition: Position, direction: Direction) {
        return {
            dx: (direction.x > 0) ? 1 - (startPosition.x - Math.floor(startPosition.x)) : startPosition.x - Math.floor(startPosition.x),
            dy: (direction.y > 0) ? 1 - (startPosition.y - Math.floor(startPosition.y)) : startPosition.y - Math.floor(startPosition.y)
        };
    }
    
    public getScalingFactors(direction: Direction) {
        return {
            sx: (direction.x !== 0) ? 1 / Math.abs(direction.x) : Infinity,
            sy: (direction.y !== 0) ? 1 / Math.abs(direction.y) : Infinity
        };
    }
    
    public getNextCellPosition(currentCellPosition: Position, xLineLength: number, yLineLength: number, direction: Direction): Position {
        const { x, y } = currentCellPosition;
        const dx = Math.sign(direction.x);
        const dy = Math.sign(direction.y);

        return (xLineLength < yLineLength) ? { x: x + dx, y } : { x, y: y + dy };
    }

    /**
    * Calculates the distance to the nearest cell of a certain type, based on the starting position, direction and a predicate that takes a position.
    * @param startPosition - The starting position in the grid. Needs to be divided by the actual cell size in pixels before calling this function.
    * @param direction - The direction vector.
    * @param isWantedCellType - A predicate function that takes a position and returns true if the cell at that position is the desired cell type.
    * @returns The distance to the nearest cell matching the given predicate, based on a grid cell size of 1 (needs to be multiplied by actual cell size in pixels).
    */
    public getCellCollisionVector(startPos: Position, direction: Direction, isWantedCellType: (pos: Position) => boolean, cols: number, rows: number): Vector2 {
        const { dx, dy } = this.getInitialStepLength(startPos, direction);
        const { sx, sy } = this.getScalingFactors(direction);
        
        let xLen = dx * sx;
        let yLen = dy * sy;
        let lastPos = { x: Math.floor(startPos.x), y: Math.floor(startPos.y) }
        const isEdgeCell = (pos: Position) => pos.x === 0 || pos.x === cols - 1 || pos.y === 0 || pos.y === rows - 1;
    
        let curPos: Position = this.getNextCellPosition(lastPos, xLen, yLen, direction);
        
        while (!isWantedCellType(curPos) && !isEdgeCell(lastPos)) {
            curPos = this.getNextCellPosition(lastPos, xLen, yLen, direction);
            if (!isWantedCellType(curPos)) {
                lastPos = curPos;
                (xLen < yLen) ? xLen += sx : yLen += sy;
            }
        }
    
        const magnitude = Math.min(xLen, yLen);
        return Vector2.from(magnitude, direction);

    }
     

}

