export type Position = { x: number, y: number };
export type Vector2 = { x: number; y: number; }

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
    private getInitialStepLength(startPosition: Position, direction: Vector2) {
        const dx = (direction.x > 0) ? 1 - (startPosition.x - Math.floor(startPosition.x)) : startPosition.x - Math.floor(startPosition.x);
        const dy = (direction.y > 0) ? 1 - (startPosition.y - Math.floor(startPosition.y)) : startPosition.y - Math.floor(startPosition.y);
        return { dx: dx, dy: dy };
    }

    /**
     * Gets the scaling factors for x and y axes, based on the direction vector.
     * @param direction - The direction vector.
     * @returns An object containing the scaling factors for x and y axes.
     */
    private getScalingFactors(direction: Vector2) {
        const sx = 1 + (Math.abs(direction.y) / Math.abs(direction.x));
        const sy = 1 + (Math.abs(direction.x) / Math.abs(direction.y));
        return { sx: sx, sy: sy };
    }

    /**
     * Gets the position of the next cell to check, based on the current cell position, line lengths and direction vector.
     * @param currentCellPosition - The current cell position in the grid.
     * @param xLineLength - The length of the line to the next vertical cell boundary.
     * @param yLineLength - The length of the line to the next horizontal cell boundary.
     * @param direction - The direction vector.
     * @returns The position of the next cell to check.
     */
    private getNextCellPosition(currentCellPosition: Position, xLineLength: number, yLineLength: number, direction: Vector2): Position {
        const { x, y } = currentCellPosition;
        const dx = direction.x > 0 ? 1 : -1;
        const dy = direction.y > 0 ? 1 : -1;

        return xLineLength < yLineLength ? { x: x + dx, y } : { x, y: y + dy };
    }

    /**
    * Calculates the distance to the nearest cell of a certain type, based on the starting position, direction and a predicate that takes a position.
    * @param startPosition - The starting position in the grid. Needs to be divided by the actual cell size in pixels before calling this function.
    * @param direction - The direction vector.
    * @param isWantedCellType - A predicate function that takes a position and returns true if the cell at that position is the desired cell type.
    * @returns The distance to the nearest cell of the given type, based on a grid cell size of 1 (needs to be multiplied by actual cell size in pixels).
    */
    public getDistanceToCellType(startPosition: Position, direction: Vector2, isWantedCellType: (position: Position) => boolean): number {
        const { dx, dy } = this.getInitialStepLength(startPosition, direction);
        const { sx, sy } = this.getScalingFactors(direction);

        let isWallFound = false;
        let distanceToWall = 0;
        let xLineLength = dx * sx;
        let yLineLength = dy * sy;
        let currentCellPosition = startPosition;

        while (!isWallFound) {
            const nextCellPosition = this.getNextCellPosition(currentCellPosition, xLineLength, yLineLength, direction);
            if (isWantedCellType(nextCellPosition)) {
                isWallFound = true;
                distanceToWall = (xLineLength < yLineLength) ? xLineLength : yLineLength;
            } else {
                currentCellPosition = nextCellPosition;
                xLineLength += sx;
                yLineLength += sy;
            }
        }

        return distanceToWall;
    }

}
