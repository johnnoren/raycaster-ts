import { MazeFacade } from "./maze/src";

const maze = new MazeFacade().getMaze(10, 10, 2);
const viewer = new MazeFacade().getViewer(500, 500);

viewer.draw(maze);
