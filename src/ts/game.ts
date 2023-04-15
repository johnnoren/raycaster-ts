import { GameLoop } from "./gameLoop.js";
import { GameObject, Status } from "./gameObject.js";
import { GameObjectManager } from "./gameObjectManager.js";
import { InfoManager } from "./infoManager.js";
import { InputManager } from "./inputManager.js";
import { BlockType, Maze2dFactory, Cell, Position } from "./maze2dFactory.js";
import { Player } from "./player.js";
import { Ray } from "./ray.js";

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

    constructor() {

        // ---- MAP ----
        this.mapCanvas = document.createElement('canvas');
        this.mapCanvas.width = 500;
        this.mapCanvas.height = 500;
        this.mapCanvas.id = CanvasId.map;
        const mapDiv = document.getElementById('map') as HTMLDivElement;
        mapDiv.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
        mapDiv.appendChild(this.mapCanvas);

        const mapCols = 21;
        const mapRows = 21;
        const tileSize = this.mapCanvas.width / mapCols;

        const map = new Maze2dFactory().createMaze(mapCols, mapRows, tileSize);
        this.gameObjects.push(map);
        this.canvases.push(this.mapCanvas);


        // ---- PLAYER ----
        const playerStartingCell: Cell = map.getClosestCell({ x: Math.floor(mapCols / 2), y: Math.floor(mapRows / 2) }, BlockType.Path);
        const playerStartingPosition: Position = { x: playerStartingCell.position.x * tileSize + (tileSize / 2), y: playerStartingCell.position.y * tileSize + (tileSize / 2) };
        this.player = new Player(playerStartingPosition, { x: 0, y: 1 }, Status.Active, map);
        this.gameObjects.push(this.player);

        // ---- FOV ----
        this.fovCanvas = document.createElement('canvas');
        this.fovCanvas.width = 500;
        this.fovCanvas.height = 500;
        this.fovCanvas.id = CanvasId.fov;
        const fovDiv = document.getElementById('fov') as HTMLDivElement;
        fovDiv.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
        fovDiv.appendChild(this.fovCanvas);
        const context = this.fovCanvas.getContext('2d')!;
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, this.fovCanvas.width, this.fovCanvas.height);
        this.canvases.push(this.fovCanvas);

        // ---- RAYS ----
        const playerFov = 90 * (Math.PI / 180);
        const numberOfRays = 480;
        const canvasWidth = this.fovCanvas.width;
        const distanceToProjectionPlane = (canvasWidth / 2) / Math.tan(playerFov / 2);
        const rayOffset = playerFov / (numberOfRays - 1);
        const centralRayIndex = Math.floor(numberOfRays / 2);
        for (let i = 0; i < numberOfRays; i += 1) {
            const offset = -playerFov / 2 + i * rayOffset;
            const color = (i === centralRayIndex) ? "red" : "yellow";
            const blockSize = 32;
            const ray = new Ray(this.player, Status.Active, map, offset, i, numberOfRays, color, distanceToProjectionPlane, blockSize);

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
        this.gameObjectsManager.render(this.canvases);
    }

    public start(): void {
        this.gameLoop.start();
    }

}