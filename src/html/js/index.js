import { Maze2d } from "./maze/src/maze2d.js";
import { View } from "./maze/src/view.js";
const maze = new Maze2d(51, 51);
const view = new View(maze, 500, 500);
view.draw();
