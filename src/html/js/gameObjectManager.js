import { Status } from "./gameObject.js";
export class GameObjectManager {
    constructor() {
        this.gameObjects = [];
    }
    add(gameObject) {
        this.gameObjects.push(gameObject);
    }
    update() {
        this.gameObjects.forEach(gameObject => gameObject.update());
        this.deleteInactiveGameObjects();
    }
    render(canvases) {
        this.clearCanvases(canvases);
        this.gameObjects.forEach(gameObject => gameObject.render(canvases));
    }
    deleteInactiveGameObjects() {
        this.gameObjects = this.gameObjects.filter(gameObject => gameObject.status === Status.Active);
    }
    clearCanvases(canvases) {
        canvases.forEach(gameCanvas => {
            const context = gameCanvas.canvas.getContext('2d');
            context.clearRect(0, 0, gameCanvas.canvas.width, gameCanvas.canvas.height);
        });
    }
}
