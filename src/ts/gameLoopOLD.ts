import { GameObjectManager } from "./gameObjectManager.js";

export class GameLoop {
//private readonly MS_PER_UPDATE = 16.67; // assuming 60fps
private readonly MS_PER_UPDATE = 60; // assuming 1fps
private previous: number = performance.now();
private lag: number = 0.0; 
private readonly gameObjectManager: GameObjectManager;
private gameOver: boolean = false;
private mapCanvas: HTMLCanvasElement;

constructor(gameObjectManager: GameObjectManager, mapCanvas: HTMLCanvasElement) {
    this.gameObjectManager = gameObjectManager;
    this.mapCanvas = mapCanvas;
}

public start(): void {

    while (!this.gameOver) {
        const current: number = performance.now();
        const elapsed: number = current - this.previous;
        this.previous = current;
        this.lag += elapsed;
    
        this.processInput();
    
        this.update();
    
        window.requestAnimationFrame(() => this.render());

        //this.gameOver = true;
    }
}

private processInput(): void {}

private update(): void {
    while (this.lag >= this.MS_PER_UPDATE) {
        this.gameObjectManager.update();
        this.lag -= this.MS_PER_UPDATE;
    }
}

private render(): void {
    while (this.lag >= this.MS_PER_UPDATE) {
        console.log('rendering...')
        this.gameObjectManager.render(this.mapCanvas);
        this.lag -= this.MS_PER_UPDATE;
    }
}

}