export type Position = { x: number; y: number };
export type Vector2 = { x: number; y: number };

/**
 * Calculates the shortest distance in a certain direction to a specified cell type in a grid using the digital differential analyzer (DDA) algorithm.
 */
export class Dda {

    /**
     * Gets the initial step length for x and y axes, based on the start position and direction.
     * @param startPosition - The starting position in the grid.
     * @param direction - The direction vector.
     * @returns An object containing the initial step lengths for x and y axes.
     */
    public getInitialStepLength(startPosition: Position, direction: Vector2) {
        return {
            dx: (direction.x > 0) ? 1 - (startPosition.x - Math.floor(startPosition.x)) : startPosition.x - Math.floor(startPosition.x),
            dy: (direction.y > 0) ? 1 - (startPosition.y - Math.floor(startPosition.y)) : startPosition.y - Math.floor(startPosition.y)
        };
    }
    
    /**
     * Gets the scaling factors for x and y axes, based on the direction vector.
     * @param direction - The direction vector.
     * @returns An object containing the scaling factors for x and y axes.
     */
    public getScalingFactors(direction: Vector2) {
        return {
            sx: (direction.x !== 0) ? 1 / Math.abs(direction.x) : Infinity,
            sy: (direction.y !== 0) ? 1 / Math.abs(direction.y) : Infinity
        };
    }
    
    
    /**
     * Gets the position of the next cell to check, based on the current cell position, line lengths and direction vector.
     * @param currentCellPosition - The current cell position in the grid.
     * @param xLineLength - The length of the line to the next vertical cell boundary.
     * @param yLineLength - The length of the line to the next horizontal cell boundary.
     * @param direction - The direction vector.
     * @returns The position of the next cell to check.
     */
    public getNextCellPosition(currentCellPosition: Position, xLineLength: number, yLineLength: number, direction: Vector2): Position {
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
    * @returns The distance to the nearest cell of the given type, based on a grid cell size of 1 (needs to be multiplied by actual cell size in pixels).
    */
    public getDistanceToCellType(startPos: Position, direction: Vector2, isWantedCellType: (pos: Position) => boolean, cols: number, rows: number): { distanceToWantedCell: number, cellPosition: Position } {
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
    
        return { distanceToWantedCell: Math.min(xLen, yLen), cellPosition: curPos };
    }
     

}

