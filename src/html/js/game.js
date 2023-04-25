import { Dda } from "./math/dda.js";
import { Floor } from "./floor.js";
import { GameLoop } from "./gameLoop.js";
import { Status } from "./gameObject.js";
import { GameObjectManager } from "./gameObjectManager.js";
import { InfoManager } from "./infoManager.js";
import { InputManager } from "./inputManager.js";
import { MazeMap2Factory } from "./mazeMap2Factory.js";
import { Player } from "./player.js";
import { Ray } from "./ray.js";
import { Roof } from "./roof.js";
import { Vector2 } from "./math/vector2.js";
import { Direction } from "./math/direction.js";
import { BlockType } from "./gameObjects/map2.js";
export var CanvasId;
(function (CanvasId) {
    CanvasId["map"] = "map";
    CanvasId["fov"] = "fov";
})(CanvasId || (CanvasId = {}));
export class Game {
    constructor() {
        this.gameObjects = [];
        this.canvases = [];
        const canvasContainer = document.getElementById('canvas-container');
        this.fovCanvas = document.createElement('canvas');
        this.fovCanvas.width = 1280;
        this.fovCanvas.height = 720;
        this.fovCanvas.id = CanvasId.fov;
        canvasContainer.appendChild(this.fovCanvas);
        const context = this.fovCanvas.getContext('2d');
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, this.fovCanvas.width, this.fovCanvas.height);
        this.canvases.push(this.fovCanvas);
        this.mapCanvas = document.createElement('canvas');
        this.mapCanvas.width = 180;
        this.mapCanvas.height = 180;
        this.mapCanvas.id = CanvasId.map;
        canvasContainer.appendChild(this.mapCanvas);
        this.mapCols = 21;
        this.mapRows = 21;
        const map = new MazeMap2Factory().createMaze(this.mapCols, this.mapRows);
        this.gameObjects.push(map);
        this.canvases.push(this.mapCanvas);
        const centerOfGrid = new Vector2(Math.floor(this.mapCols / 2), Math.floor(this.mapRows / 2));
        const playerStartingCellPosition = map.getClosestCellPosition(centerOfGrid, BlockType.Path);
        const playerStartingPosition = new Vector2(playerStartingCellPosition.x + 0.5, playerStartingCellPosition.y + 0.5);
        this.player = new Player(playerStartingPosition, new Direction(new Vector2(0, -1)), Status.Active, map);
        this.gameObjects.push(this.player);
        const roof = new Roof(Status.Active);
        this.gameObjects.push(roof);
        const floor = new Floor(Status.Active);
        this.gameObjects.push(floor);
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
        this.gameObjectsManager = new GameObjectManager();
        this.gameObjects.forEach(gameObject => this.gameObjectsManager.add(gameObject));
        this.inputManager = new InputManager(this.player);
        const gameLoopOptions = {
            input: this.input.bind(this),
            update: this.update.bind(this),
            render: this.render.bind(this)
        };
        this.gameLoop = new GameLoop(gameLoopOptions);
        this.infoManager = new InfoManager(this.gameLoop);
    }
    input() {
        this.inputManager.handleInput();
    }
    update() {
        this.gameObjectsManager.update();
        this.infoManager.update();
    }
    render() {
        this.gameObjectsManager.render(this.canvases, this.mapCanvas.width / this.mapCols);
    }
    start() {
        this.gameLoop.start();
    }
}
