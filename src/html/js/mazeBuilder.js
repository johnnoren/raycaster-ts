export class MazeBuilder {
    constructor(array) {
        this.DIRECTIONS = [
            [0, 2],
            [2, 0],
            [0, -2],
            [-2, 0],
        ];
        this.rows = array.length;
        this.cols = array[0].length;
        this.array = array.map(row => row.map(() => 1));
    }
    getRandomPoint() {
        return [
            Math.floor(Math.random() * (this.cols / 2)) * 2,
            Math.floor(Math.random() * (this.rows / 2)) * 2,
        ];
    }
    addPoints(p1, p2) {
        return [p1[0] + p2[0], p1[1] + p2[1]];
    }
    inBounds(point) {
        return (point[0] >= 0 && point[0] < this.cols && point[1] >= 0 && point[1] < this.rows);
    }
    carveMaze() {
        let visitedCount = 1;
        const totalCells = Math.floor((this.rows * this.cols) / 2);
        const visited = new Set();
        const initialPoint = this.getRandomPoint();
        visited.add(`${initialPoint[0]},${initialPoint[1]}`);
        this.array[initialPoint[1]][initialPoint[0]] = 0;
        let current = initialPoint;
        while (visitedCount < totalCells) {
            const randomIndex = Math.floor(Math.random() * this.DIRECTIONS.length);
            const nextDir = this.DIRECTIONS[randomIndex];
            const nextPoint = this.addPoints(current, nextDir);
            if (this.inBounds(nextPoint)) {
                const nextStr = `${nextPoint[0]},${nextPoint[1]}`;
                if (!visited.has(nextStr)) {
                    visited.add(nextStr);
                    visitedCount++;
                    const wallPoint = this.addPoints(current, [
                        nextDir[0] / 2,
                        nextDir[1] / 2,
                    ]);
                    this.array[wallPoint[1]][wallPoint[0]] = 0;
                    this.array[nextPoint[1]][nextPoint[0]] = 0;
                }
                current = nextPoint;
            }
            else {
                const unvisitedPoints = [...visited].map(coords => coords.split(",").map(Number));
                current = unvisitedPoints[Math.floor(Math.random() * unvisitedPoints.length)];
            }
        }
        return this.array;
    }
}
