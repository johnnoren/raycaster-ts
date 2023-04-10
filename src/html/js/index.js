import { MazeFacade } from "./maze/src/index.js";
const maze = new MazeFacade().getMaze(51, 51);
const viewer = new MazeFacade().getMazeViewer(maze, 500, 500);
viewer.draw();
