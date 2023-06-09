import { Dda } from "./math/dda.js";
import { Floor } from "./gameObjects/floor.js";
import { GameLoop } from "./gameLoop.js";
import { GameObject, Status } from "./gameObject.js";
import { GameObjectManager } from "./gameObjectManager.js";
import { InfoManager } from "./infoManager.js";
import { InputManager } from "./inputManager.js";
import { MazeMap2Factory } from "./mazeMap2Factory.js";
import { Player } from "./gameObjects/player.js";
import { Ray } from "./gameObjects/ray.js";
import { Roof } from "./gameObjects/roof.js";
import { Vector2 } from "./math/vector2.js";
import { Direction } from "./math/direction.js";
import { BlockType } from "./gameObjects/map2.js";

export enum CanvasId {
    map = "map",
    fov = "fov"
}

export class Game {
    private gameObjects: GameObject[] = [];
    private mapCanvas: HTMLCanvasElement;
    private gameLoop: GameLoop;
    private gameObjectsManager: GameObjectManager;
    private player: Player;
    private inputManager: InputManager;
    private canvases: HTMLCanvasElement[] = [];
    private fovCanvas: HTMLCanvasElement;
    private infoManager: InfoManager;
    private mapCols: number;
    private mapRows: number;
    private blockSize: number;

    constructor() {

        // ---- CANVAS CONTAINER ----
        const canvasContainer = document.querySelector('.canvas-wrapper') as HTMLDivElement;

        // ---- FOV ----
        this.fovCanvas = document.createElement('canvas');
        this.fovCanvas.width = 1280;
        this.fovCanvas.height = 720;
        this.fovCanvas.id = CanvasId.fov;
        this.fovCanvas.classList.add('centered');
        canvasContainer.appendChild(this.fovCanvas);
        this.canvases.push(this.fovCanvas);

        // ---- MAP ----
        this.mapCanvas = document.createElement('canvas');
        this.mapCanvas.width = 180;
        this.mapCanvas.height = 180;
        this.mapCanvas.id = CanvasId.map;
        this.mapCanvas.classList.add('top-left');
        canvasContainer.appendChild(this.mapCanvas);

        this.mapCols = 21;
        this.mapRows = 21;
        this.blockSize = this.mapCanvas.width / this.mapCols;

        const map = new MazeMap2Factory().createMaze(this.mapCols, this.mapRows);
        this.gameObjects.push(map);
        this.canvases.push(this.mapCanvas);

        // ---- PLAYER ----
        const centerOfGrid = new Vector2(Math.floor(this.mapCols / 2), Math.floor(this.mapRows / 2));
        const playerStartingCellPosition: Vector2 = map.getClosestCellPosition(centerOfGrid, BlockType.Path);
        const playerStartingPosition: Vector2 = new Vector2(playerStartingCellPosition.x + 0.5, playerStartingCellPosition.y + 0.5);
        this.player = new Player(playerStartingPosition, new Direction(new Vector2(0,-1)), Status.Active, map);
        this.gameObjects.push(this.player);

        // ---- ROOF ----
        const roof = new Roof(Status.Active);
        this.gameObjects.push(roof);

        // ---- FLOOR ----
        const floor = new Floor(Status.Active);
        this.gameObjects.push(floor);

        // ---- RAYS ----
        const playerFov = 90 * (Math.PI / 180);
        const numberOfRays = 1280;
        const canvasWidth = this.fovCanvas.width;
        const distanceToProjectionPlane = (canvasWidth / 2) / Math.tan(playerFov / 2);
        const centralRayIndex = Math.floor(numberOfRays / 2);
        const dda = new Dda();
        const blockSize = this.mapCanvas.width / this.mapCols;
        for (let i = 0; i < numberOfRays; i += 1) {
            const rayScreenPosX = i - numberOfRays / 2;
            const relativeAngle = Math.atan2(rayScreenPosX, distanceToProjectionPlane);
            const color = (i === centralRayIndex) ? "red" : "yellow";
            const ray = new Ray(this.player, Status.Active, map, relativeAngle, i, numberOfRays, color, distanceToProjectionPlane, blockSize, dda);
        
            this.gameObjects.push(ray);
        }

        // ---- GAME OBJECT MANAGER ----
        this.gameObjectsManager = new GameObjectManager();
        this.gameObjects.forEach(gameObject => this.gameObjectsManager.add(gameObject));


        // ---- INPUT MANAGER ----
        this.inputManager = new InputManager(this.player);


        // ---- GAME LOOP ----
        const gameLoopOptions = {
            input: this.input.bind(this),
            update: this.update.bind(this),
            render: this.render.bind(this)
        };
        this.gameLoop = new GameLoop(gameLoopOptions);

        // ---- FPS ----
        this.infoManager = new InfoManager(this.gameLoop);
    }

    public input(): void {
        this.inputManager.handleInput();
    }

    public update(): void {
        this.gameObjectsManager.update();
        this.infoManager.update();
    }

    public render(): void {
        this.gameObjectsManager.render(this.canvases, this.blockSize);
    }

    public start(): void {
        this.gameLoop.start();
    }

}