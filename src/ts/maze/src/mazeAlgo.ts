import { Grid2d } from "./grid2d.js";

export class MazeAlgo {

    // Uses Kruskal's randomised algorithm to generate a maze.
    generate(grid: Grid2d): Grid2d {
        
        const innerCells = grid.getInnerCellPositions()
        grid.fillWithSequentialNumbers(innerCells);

        const innerIntersectionCells = grid.getInnerIntersectionCellPositions();
        this.#shuffleArray(innerIntersectionCells);

        innerIntersectionCells.forEach((intersection) => {
            const adjacentCellValues = grid.getConnectedCellValues(intersection);
            const cellValuesDiffer = (cellValues: number[]) => cellValues[0] !== cellValues[1];
            const getLowestValue = (cellValues: number[]) => Math.min(...cellValues);
            const getHighestValue = (cellValues: number[]) => Math.max(...cellValues);

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

    #shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}