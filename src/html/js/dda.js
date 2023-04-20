export class Dda {
    getInitialStepLength(startPosition, direction) {
        return {
            dx: (direction.x > 0) ? 1 - (startPosition.x - Math.floor(startPosition.x)) : startPosition.x - Math.floor(startPosition.x),
            dy: (direction.y > 0) ? 1 - (startPosition.y - Math.floor(startPosition.y)) : startPosition.y - Math.floor(startPosition.y)
        };
    }
    getScalingFactors(direction) {
        return {
            sx: (direction.x !== 0) ? 1 / Math.abs(direction.x) : 0,
            sy: (direction.y !== 0) ? 1 / Math.abs(direction.y) : 0
        };
    }
    getNextCellPosition(currentCellPosition, xLineLength, yLineLength, direction) {
        const { x, y } = currentCellPosition;
        const dx = direction.x > 0 ? 1 : -1;
        const dy = direction.y > 0 ? 1 : -1;
        return (xLineLength < yLineLength) ? { x: x + dx, y } : { x, y: y + dy };
    }
    getDistanceToCellType(startPosition, direction, isWantedCellType, cols, rows) {
        const { dx, dy } = this.getInitialStepLength(startPosition, direction);
        const { sx, sy } = this.getScalingFactors(direction);
        let isWantedCellTypeFound = false;
        let distanceToWall = 0;
        let xLineLength = dx * sx;
        let yLineLength = dy * sy;
        let currentCellPosition = { x: Math.floor(startPosition.x), y: Math.floor(startPosition.y) };
        let totalDistanceTraveled = 0;
        const distanceToEdge = (dx + cols - Math.abs(startPosition.x)) * sx;
        while (!isWantedCellTypeFound && totalDistanceTraveled < distanceToEdge) {
            const nextCellPosition = this.getNextCellPosition(currentCellPosition, xLineLength, yLineLength, direction);
            if (isWantedCellType(nextCellPosition)) {
                isWantedCellTypeFound = true;
                distanceToWall = Math.min(xLineLength, yLineLength);
            }
            else {
                currentCellPosition = nextCellPosition;
                totalDistanceTraveled += (xLineLength < yLineLength) ? sx : sy;
                if (xLineLength < yLineLength) {
                    xLineLength += sx;
                }
                else {
                    yLineLength += sy;
                }
            }
        }
        return (isWantedCellTypeFound) ? distanceToWall : distanceToEdge;
    }
}
