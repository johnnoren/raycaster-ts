import { Grid2d } from "../../grid/src/index.js";
import { MazeAlgo } from "./mazeAlgo.js";

export class KruskalsAlgo implements MazeAlgo {
    executeRandom(grid: Grid2d<number>, exits: number): Grid2d<number> {
        const innerIntersectionCellValues = this.#generateInnerIntersectionCellValuesRandomly(grid);
        return this.#execute(grid, innerIntersectionCellValues, exits);
    }
    executeFromSeed(grid: Grid2d<number>, seed: string): Grid2d<number> {
        const exits = parseInt(seed.split('e')[0]!);
        const innerIntersectionCellValues = this.#generateInnerIntersectionCellValuesFromSeed(seed.split('e')[1]!);
        return this.#execute(grid, innerIntersectionCellValues, exits);
    }

    #execute(grid: Grid2d<number>, innerIntersectionCellValues: number[], exits: number): Grid2d<number> {
        const perimeterIntersectionCellPositions = this.#getPerimeterIntersectionCellPositions(grid);
        const innerIntersectionCellPositions = this.#getInnerIntersectionCellPositions(grid);
        const innerCellPositions = this.#getInnerCellPositions(grid);
        const cellValuesDiffer = (cellValues: number[]) => cellValues[0] !== cellValues[1];

        this.#fillInnerCells(grid, innerCellPositions);

        innerIntersectionCellPositions.forEach((position, index) => {
            const adjacentCellValues = this.#getAdjacentCellValues(grid, position);
            if (cellValuesDiffer(adjacentCellValues)) {
                this.#setCellValuesToLowest(grid, adjacentCellValues);
            }
        });

        this.#setExits(grid, perimeterIntersectionCellPositions, exits);

        return grid;
    }

    #generateInnerIntersectionCellValuesFromSeed(seed: string): number[] {
        const intersectionCellValues = seed.split(':');
        return intersectionCellValues.map(value => parseInt(value))
    }

    #generateInnerIntersectionCellValuesRandomly(grid: Grid2d<number>): number[] {
        const intersectionCellValues = [];
        for (let i = 0; i < grid.cols * grid.rows; i++) {
            intersectionCellValues.push(i);
        }
        return this.#shuffleArray(intersectionCellValues);
    }

    #shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j]!, array[i]!];
        }
        return array;
      }

      #getPerimeterIntersectionCellPositions(grid: Grid2d<number>): {x: number, y: number}[] {
        const perimeterIntersectionCellPositions = [];
        for (let x = 1; x < grid.cols - 1; x += 2) {
            perimeterIntersectionCellPositions.push({x, y: 0});
            perimeterIntersectionCellPositions.push({x, y: grid.rows - 1});
        }
        for (let y = 1; y < grid.rows - 1; y++) {
            perimeterIntersectionCellPositions.push({x: 0, y});
            perimeterIntersectionCellPositions.push({x: grid.cols - 1, y});
        }
        return perimeterIntersectionCellPositions;
      }

      #getInnerIntersectionCellPositions(grid: Grid2d<number>): {x: number, y: number}[] {
        const innerIntersectionCellPositions = [];

        for (let y = 1; y < grid.rows - 1; y += 1) {
            if (y % 2 === 1) {
                for (let x = 2; x < grid.cols - 2; x += 2) {
                    innerIntersectionCellPositions.push({x, y});
                }
            } else {
                for (let x = 1; x < grid.cols - 1; x += 2) {
                    innerIntersectionCellPositions.push({x, y});
                }
            }
        }
        return innerIntersectionCellPositions;
      }

      #getInnerCellPositions(grid: Grid2d<number>): {x: number, y: number}[] {
        const innerCellPositions = [];
        for (let y = 1; y < grid.rows - 1; y += 2) {
            for (let x = 1; x < grid.cols - 1; x += 2) {
                innerCellPositions.push({x, y});
            }
        }
        return innerCellPositions;
      }

      #fillInnerCells(grid: Grid2d<number>, innerCellPositions: {x: number, y: number}[]): void {
        let counter = 0;
        for (const {x, y} of innerCellPositions) {
            grid.set(x, y, counter);
            counter++;
        }
    }

    #getAdjacentCellValues(grid: Grid2d<number>, position: { x: number, y: number }): number[] {
        if (position.y % 2 === 1) {
            return [
                grid.get(position.x - 1, position.y),
                grid.get(position.x + 1, position.y),
            ];
        } else {
            return [
                grid.get(position.x, position.y - 1),
                grid.get(position.x, position.y + 1),
            ];
        }
    }

    #setCellValuesToLowest(grid: Grid2d<number>, cellValues: number[]): void {
        const lowestCellValue = Math.min(...cellValues);
        grid.forEachInArea(2,2,grid.cols-1,grid.rows-1,(array, x, y) => {
            array[x]![y] = lowestCellValue;
        });
    }

    #setExits(grid: Grid2d<number>, perimeterIntersectionCellPositions: {x: number, y: number}[], exits: number): void {
        const exitPositions = this.#shuffleArray(perimeterIntersectionCellPositions).slice(0, exits);
        exitPositions.forEach(position => {
            grid.set(position.x, position.y, 0);
        });
    }

}

