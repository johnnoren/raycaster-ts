import { GameLoop } from "./gameLoop.js";
import { Status } from "./gameObject.js";
import { GameObjectManager } from "./gameObjectManager.js";
import { InputManager } from "./inputManager.js";
import { BlockType, Maze2dFactory } from "./maze2dFactory.js";
import { Player } from "./player.js";
export class Game {
    constructor() {
        this.gameObjects = [];
        this.mapCanvas = document.createElement('canvas');
        this.mapCanvas.width = 500;
        this.mapCanvas.height = 500;
        const mapDiv = document.getElementById('map');
        mapDiv.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
        mapDiv.appendChild(this.mapCanvas);
        const mapCols = 21;
        const mapRows = 21;
        const tileSize = this.mapCanvas.width / mapCols;
        const map = new Maze2dFactory().createMaze(mapCols, mapRows, tileSize);
        this.gameObjects.push(map);
        const playerStartingCell = map.getClosestCell({ x: Math.floor(mapCols / 2), y: Math.floor(mapRows / 2) }, BlockType.Path);
        const playerStartingPosition = { x: playerStartingCell.position.x * tileSize + (tileSize / 2), y: playerStartingCell.position.y * tileSize + (tileSize / 2) };
        this.player = new Player(playerStartingPosition, { x: 0, y: 1 }, Status.Active, map);
        this.gameObjects.push(this.player);
        this.gameObjectsManager = new GameObjectManager();
        this.gameObjects.forEach(gameObject => this.gameObjectsManager.add(gameObject));
        this.inputManager = new InputManager(this.player);
        this.gameLoopOptions = {
            input: this.input.bind(this),
            update: this.update.bind(this),
            render: this.render.bind(this)
        };
        this.gameLoop = new GameLoop(this.gameLoopOptions);
        this.fovCanvas = document.createElement('canvas');
        this.fovCanvas.width = 500;
        this.fovCanvas.height = 500;
        const fovDiv = document.getElementById('fov');
        fovDiv.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
        fovDiv.appendChild(this.fovCanvas);
        const context = this.fovCanvas.getContext('2d');
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, this.fovCanvas.width, this.fovCanvas.height);
    }
    input() {
        this.inputManager.handleInput();
    }
    update() {
        this.gameObjectsManager.update();
    }
    render() {
        this.gameObjectsManager.render(this.mapCanvas);
    }
    start() {
        this.gameLoop.start();
    }
}
