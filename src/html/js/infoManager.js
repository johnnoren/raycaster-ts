export class InfoManager {
    constructor(gameLoop) {
        this.fpsSamples = [];
        this.maxSamples = 30;
        this.infoElement = document.getElementById("info");
        this.gameLoop = gameLoop;
    }
    update() {
        const fps = this.gameLoop.getFps();
        this.fpsSamples.push(fps);
        if (this.fpsSamples.length > this.maxSamples) {
            this.fpsSamples.shift();
        }
        const fpsAverage = this.fpsSamples.reduce((sum, value) => sum + value, 0) / this.fpsSamples.length;
        this.infoElement.innerHTML = `FPS: ${fpsAverage.toFixed(2)}`;
    }
}
