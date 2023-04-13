import { GameLoop } from "./gameLoop.js";

export class InfoManager {
    private infoElement: HTMLElement;
    private gameLoop: GameLoop;
    private fpsSamples: number[] = [];
    private maxSamples: number = 30;


    constructor(gameLoop: GameLoop) {
        this.infoElement = document.getElementById("info") as HTMLElement;
        this.gameLoop = gameLoop;
    }

    public update(): void {
        const fps = this.gameLoop.getFps();
        this.fpsSamples.push(fps);

        if (this.fpsSamples.length > this.maxSamples) {
            this.fpsSamples.shift();
        }

        const fpsAverage = this.fpsSamples.reduce((sum, value) => sum + value, 0) / this.fpsSamples.length;

        this.infoElement.innerHTML = `FPS: ${fpsAverage.toFixed(2)}`;
    }

}