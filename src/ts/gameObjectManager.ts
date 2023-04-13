import { GameObject, Status } from "./gameObject.js";

export class GameObjectManager {
    private gameObjects: GameObject[] = [];

    public add(gameObject: GameObject): void {
        this.gameObjects.push(gameObject);
    }

    public update(): void {
        this.gameObjects.forEach(gameObject => gameObject.update());
        this.deleteInactiveGameObjects();
    }

    public render(canvas: HTMLCanvasElement): void {
        const context = canvas.getContext('2d');
        //context!.clearRect(0, 0, canvas.width, canvas.height);
        this.gameObjects.forEach(gameObject => gameObject.render(canvas));
    }

    private deleteInactiveGameObjects(): void {
        this.gameObjects = this.gameObjects.filter(gameObject => gameObject.status === Status.Active);
    }

    
}