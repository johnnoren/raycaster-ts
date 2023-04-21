export class Dda {
    getInitialStepLength(startPosition, direction) {
        return {
            dx: (direction.x > 0) ? 1 - (startPosition.x - Math.floor(startPosition.x)) : startPosition.x - Math.floor(startPosition.x),
            dy: (direction.y > 0) ? 1 - (startPosition.y - Math.floor(startPosition.y)) : startPosition.y - Math.floor(startPosition.y)
        };
    }
    getScalingFactors(direction) {
        return {
            sx: (direction.x !== 0) ? 1 / Math.abs(direction.x) : Infinity,
            sy: (direction.y !== 0) ? 1 / Math.abs(direction.y) : Infinity
        };
    }
    getNextCellPosition(currentCellPosition, xLineLength, yLineLength, direction) {
        const { x, y } = currentCellPosition;
        const dx = Math.sign(direction.x);
        const dy = Math.sign(direction.y);
        return (xLineLength < yLineLength) ? { x: x + dx, y } : { x, y: y + dy };
    }
    getDistanceToCellType(startPos, direction, isWantedCellType, cols, rows) {
        const { dx, dy } = this.getInitialStepLength(startPos, direction);
        const { sx, sy } = this.getScalingFactors(direction);
        let xLen = dx * sx;
        let yLen = dy * sy;
        let lastPos = { x: Math.floor(startPos.x), y: Math.floor(startPos.y) };
        const isEdgeCell = (pos) => pos.x === 0 || pos.x === cols - 1 || pos.y === 0 || pos.y === rows - 1;
        let curPos = this.getNextCellPosition(lastPos, xLen, yLen, direction);
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
