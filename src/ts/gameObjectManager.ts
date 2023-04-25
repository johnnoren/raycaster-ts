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

    public render(canvases: HTMLCanvasElement[], blockSize: number): void {
        this.clearCanvases(canvases);
        this.gameObjects.forEach(gameObject => gameObject.render(canvases, blockSize));
    }

    private deleteInactiveGameObjects(): void {
        this.gameObjects = this.gameObjects.filter(gameObject => gameObject.status === Status.Active);
    }

    private clearCanvases(canvases: HTMLCanvasElement[]): void {
        canvases.forEach(canvas => {
            canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
        });
    }
}