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
    render(canvas) {
        const context = canvas.getContext('2d');
        this.gameObjects.forEach(gameObject => gameObject.render(canvas));
    }
    deleteInactiveGameObjects() {
        this.gameObjects = this.gameObjects.filter(gameObject => gameObject.status === Status.Active);
    }
}
