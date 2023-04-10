var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MazeAlgo_instances, _MazeAlgo_shuffleArray;
export class MazeAlgo {
    constructor() {
        _MazeAlgo_instances.add(this);
    }
    generate(grid) {
        const innerCells = grid.getInnerCellPositions();
        grid.fillWithSequentialNumbers(innerCells);
        const innerIntersectionCells = grid.getInnerIntersectionCellPositions();
        __classPrivateFieldGet(this, _MazeAlgo_instances, "m", _MazeAlgo_shuffleArray).call(this, innerIntersectionCells);
        innerIntersectionCells.forEach((intersection) => {
            const adjacentCellValues = grid.getConnectedCellValues(intersection);
            const cellValuesDiffer = (cellValues) => cellValues[0] !== cellValues[1];
            const getLowestValue = (cellValues) => Math.min(...cellValues);
            const getHighestValue = (cellValues) => Math.max(...cellValues);
            if (cellValuesDiffer(adjacentCellValues)) {
                const lowestValue = getLowestValue(adjacentCellValues);
                const highestValue = getHighestValue(adjacentCellValues);
                const cellsToChange = grid.getCellsByValue(highestValue);
                grid.setCellsToValue(cellsToChange, lowestValue);
            }
            grid.addExit();
        });
        return grid;
    }
}
_MazeAlgo_instances = new WeakSet(), _MazeAlgo_shuffleArray = function _MazeAlgo_shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};
