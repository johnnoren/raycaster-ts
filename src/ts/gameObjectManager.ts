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

    public render(canvases: HTMLCanvasElement[]): void {
        this.clearCanvases(canvases);
        this.gameObjects.forEach(gameObject => gameObject.render(canvases));
    }

    private deleteInactiveGameObjects(): void {
        this.gameObjects = this.gameObjects.filter(gameObject => gameObject.status === Status.Active);
    }

    private clearCanvases(canvases: HTMLCanvasElement[]): void {
        canvases.forEach(canvas => {
            const context = canvas.getContext('2d');
            context!.clearRect(0, 0, canvas.width, canvas.height);
        });
    }
}