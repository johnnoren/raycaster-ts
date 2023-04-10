import { MazeFacade } from "./maze/src/index.js";

const maze = new MazeFacade().getMaze(21, 21);
const viewer = new MazeFacade().getMazeViewer(maze, 500, 500);

viewer.draw();
