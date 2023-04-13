export class GameLoop {
    constructor(gameObjectManager, mapCanvas) {
        this.MS_PER_UPDATE = 60;
        this.previous = performance.now();
        this.lag = 0.0;
        this.gameOver = false;
        this.gameObjectManager = gameObjectManager;
        this.mapCanvas = mapCanvas;
    }
    start() {
        while (!this.gameOver) {
            const current = performance.now();
            const elapsed = current - this.previous;
            this.previous = current;
            this.lag += elapsed;
            this.processInput();
            this.update();
            window.requestAnimationFrame(() => this.render());
        }
    }
    processInput() { }
    update() {
        while (this.lag >= this.MS_PER_UPDATE) {
            this.gameObjectManager.update();
            this.lag -= this.MS_PER_UPDATE;
        }
    }
    render() {
        while (this.lag >= this.MS_PER_UPDATE) {
            console.log('rendering...');
            this.gameObjectManager.render(this.mapCanvas);
            this.lag -= this.MS_PER_UPDATE;
        }
    }
}
