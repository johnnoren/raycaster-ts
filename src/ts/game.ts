import { Dda } from "./dda.js";
import { Floor } from "./floor.js";
import { GameLoop } from "./gameLoop.js";
import { GameObject, Status } from "./gameObject.js";
import { GameObjectManager } from "./gameObjectManager.js";
import { InfoManager } from "./infoManager.js";
import { InputManager } from "./inputManager.js";
import { BlockType, Maze2dFactory, Cell, Position } from "./maze2dFactory.js";
import { Player } from "./player.js";
import { Ray } from "./ray.js";
import { Roof } from "./roof.js";

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
        const canvasContainer = document.getElementById('canvas-container') as HTMLDivElement;

        // ---- FOV ----
        this.fovCanvas = document.createElement('canvas');
        this.fovCanvas.width = 1280;
        this.fovCanvas.height = 720;
        this.fovCanvas.id = CanvasId.fov;
        //const fovDiv = document.getElementById('fov') as HTMLDivElement;
        //fovDiv.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
        //fovDiv.appendChild(this.fovCanvas);
        canvasContainer.appendChild(this.fovCanvas);
        const context = this.fovCanvas.getContext('2d')!;
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, this.fovCanvas.width, this.fovCanvas.height);
        this.canvases.push(this.fovCanvas);

        // ---- MAP ----
        this.mapCanvas = document.createElement('canvas');
        this.mapCanvas.width = 180;
        this.mapCanvas.height = 180;
        this.mapCanvas.id = CanvasId.map;
        //const mapDiv = document.getElementById('map') as HTMLDivElement;
        //mapDiv.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
        //mapDiv.appendChild(this.mapCanvas);
        canvasContainer.appendChild(this.mapCanvas);

        this.mapCols = 21;
        this.mapRows = 21;
        this.blockSize = this.mapCanvas.width / this.mapCols;

        const map = new Maze2dFactory().createMaze(this.mapCols, this.mapRows, this.blockSize);
        this.gameObjects.push(map);
        this.canvases.push(this.mapCanvas);


        // ---- PLAYER ----
        const playerStartingCell: Cell = map.getClosestCell({ x: Math.floor(this.mapCols / 2), y: Math.floor(this.mapRows / 2) }, BlockType.Path);
        const playerStartingPosition: Position = { x: playerStartingCell.position.x + 0.5, y: playerStartingCell.position.y + 0.5 };
        this.player = new Player(playerStartingPosition, { x: 0, y: -1 }, Status.Active, map);
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
        
        


        // debug
        //const color = "red";
        //const ray = new Ray(this.player, Status.Active, map, 0, 0, 1, color, distanceToProjectionPlane, blockSize, dda);
        //this.gameObjects.push(ray);

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
        this.gameObjectsManager.render(this.canvases, this.mapCanvas.width / this.mapCols);
    }

    public start(): void {
        this.gameLoop.start();
    }

}