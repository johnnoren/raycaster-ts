import { Array2dBuilder } from "./array2dBuilder.js";
import { MapViewer2d } from "./mapViewer2d.js";
import { MazeBuilder } from "./mazeBuilder.js";
const map = new Array2dBuilder(11, 11).fill(1).build();
const carvedMap = new MazeBuilder(map).carveMaze();
const viewer = new MapViewer2d(carvedMap);
console.log('log: ' + carvedMap);
viewer.draw();
