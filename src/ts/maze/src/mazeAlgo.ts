import { Grid2d } from "./grid2d.js";

export class MazeAlgo {

    // Uses Kruskal's randomised algorithm to generate a maze.
    public generate(grid: Grid2d): Grid2d {
        const innerCells = grid.getInnerCellPositions()
        grid.fillWithSequentialNumbers(innerCells);
        const innerIntersectionCells = grid.getInnerIntersectionCellPositions();
        this.shuffleArray(innerIntersectionCells);
        innerIntersectionCells.forEach((intersection) => {
            const adjacentCellValues = grid.getConnectedCellValues(intersection);
            const cellValuesDiffer = (cellValues: number[]) => cellValues[0] !== cellValues[1];
            const getLowestValue = (cellValues: number[]) => Math.min(...cellValues);
            const getHighestValue = (cellValues: number[]) => Math.max(...cellValues);

            if (cellValuesDiffer(adjacentCellValues)) {
                const lowestValue = getLowestValue(adjacentCellValues);
                const highestValue = getHighestValue(adjacentCellValues);
                const cellsToChange = grid.getAnyTypeOfInnerCellPositionsByValue(highestValue);
                cellsToChange.push(intersection);

                grid.setCellsToValue(cellsToChange, lowestValue);
            }
        });
        
        this.changeTempPathValueToReal(grid);
        grid.addExit();
        return grid;
    }

    private shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    private changeTempPathValueToReal(grid: Grid2d): void {
        const tempPathValue = grid.blockTypes.temp;
        const realPathValue = grid.blockTypes.path;
        const cellsToChange = grid.getAnyTypeOfInnerCellPositionsByValue(tempPathValue!);

        grid.setCellsToValue(cellsToChange, realPathValue!);
    }
}