import { Maze2d } from "./maze2d.js";
import { Player } from "./player.js";
import { View } from "./view.js";
const maze = new Maze2d(21, 21);
const startPosition = { x: maze.startPosition[0], y: maze.startPosition[1] };
const startDirection = { x: 0, y: 1 };
const player = new Player(startPosition, startDirection);
const view = new View(maze, 1000, 1000, player);
view.draw();
