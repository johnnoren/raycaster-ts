import { Dda } from "./dda.js";
import { GameLoop } from "./gameLoop.js";
import { Status } from "./gameObject.js";
import { GameObjectManager } from "./gameObjectManager.js";
import { InfoManager } from "./infoManager.js";
import { InputManager } from "./inputManager.js";
import { BlockType, Maze2dFactory } from "./maze2dFactory.js";
import { Player } from "./player.js";
import { Ray } from "./ray.js";
export var CanvasId;
(function (CanvasId) {
    CanvasId["map"] = "map";
    CanvasId["fov"] = "fov";
})(CanvasId || (CanvasId = {}));
export class Game {
    constructor() {
        this.gameObjects = [];
        this.canvases = [];
        this.mapCanvas = document.createElement('canvas');
        this.mapCanvas.width = 500;
        this.mapCanvas.height = 500;
        this.mapCanvas.id = CanvasId.map;
        const mapDiv = document.getElementById('map');
        mapDiv.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
        mapDiv.appendChild(this.mapCanvas);
        this.mapCols = 21;
        this.mapRows = 21;
        this.blockSize = this.mapCanvas.width / this.mapCols;
        const map = new Maze2dFactory().createMaze(this.mapCols, this.mapRows, this.blockSize);
        this.gameObjects.push(map);
        this.canvases.push(this.mapCanvas);
        const playerStartingCell = map.getClosestCell({ x: Math.floor(this.mapCols / 2), y: Math.floor(this.mapRows / 2) }, BlockType.Path);
        const playerStartingPosition = { x: playerStartingCell.position.x + 0.5, y: playerStartingCell.position.y + 0.5 };
        this.player = new Player(playerStartingPosition, { x: 0, y: -1 }, Status.Active, map);
        this.gameObjects.push(this.player);
        this.fovCanvas = document.createElement('canvas');
        this.fovCanvas.width = 500;
        this.fovCanvas.height = 500;
        this.fovCanvas.id = CanvasId.fov;
        const fovDiv = document.getElementById('fov');
        fovDiv.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
        fovDiv.appendChild(this.fovCanvas);
        const context = this.fovCanvas.getContext('2d');
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, this.fovCanvas.width, this.fovCanvas.height);
        this.canvases.push(this.fovCanvas);
        const playerFov = 90 * (Math.PI / 180);
        const numberOfRays = 240;
        const canvasWidth = this.fovCanvas.width;
        const distanceToProjectionPlane = (canvasWidth / 2) / Math.tan(playerFov / 2);
        const rayOffset = playerFov / (numberOfRays - 1);
        const centralRayIndex = Math.floor(numberOfRays / 2);
        const dda = new Dda();
        const blockSize = this.mapCanvas.width / this.mapCols;
        const color = "red";
        const ray = new Ray(this.player, Status.Active, map, 0, 0, 1, color, distanceToProjectionPlane, blockSize, dda);
        this.gameObjects.push(ray);
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
