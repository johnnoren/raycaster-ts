export class Dda {
    getInitialStepLength(startPosition, direction) {
        return {
            dx: (direction.x > 0) ? 1 - (startPosition.x - Math.floor(startPosition.x)) : startPosition.x - Math.floor(startPosition.x),
            dy: (direction.y > 0) ? 1 - (startPosition.y - Math.floor(startPosition.y)) : startPosition.y - Math.floor(startPosition.y)
        };
    }
    getScalingFactors(direction) {
        return {
            sx: 1 + (Math.abs(direction.y) / Math.abs(direction.x)),
            sy: 1 + (Math.abs(direction.x) / Math.abs(direction.y))
        };
    }
    getNextCellPosition(currentCellPosition, xLineLength, yLineLength, direction) {
        const { x, y } = currentCellPosition;
        const dx = direction.x > 0 ? 1 : -1;
        const dy = direction.y > 0 ? 1 : -1;
        return (xLineLength < yLineLength) ? { x: x + dx, y } : { x, y: y + dy };
    }
    getDistanceToCellType(startPosition, direction, isWantedCellType, maxLength) {
        const { dx, dy } = this.getInitialStepLength(startPosition, direction);
        const { sx, sy } = this.getScalingFactors(direction);
        let isWallFound = false;
        let distanceToWall = 0;
        let xLineLength = dx * sx;
        let yLineLength = dy * sy;
        let currentCellPosition = { x: Math.floor(startPosition.x), y: Math.floor(startPosition.y) };
        let totalDistanceTraveled = 0;
        while (!isWallFound && totalDistanceTraveled < maxLength) {
            const nextCellPosition = this.getNextCellPosition(currentCellPosition, xLineLength, yLineLength, direction);
            if (isWantedCellType(nextCellPosition)) {
                isWallFound = true;
                distanceToWall = (xLineLength < yLineLength) ? xLineLength : yLineLength;
            }
            else {
                currentCellPosition = nextCellPosition;
                const distanceTraveled = (xLineLength < yLineLength) ? sx : sy;
                totalDistanceTraveled += distanceTraveled;
                xLineLength += sx;
                yLineLength += sy;
            }
        }
        return distanceToWall;
    }
}
