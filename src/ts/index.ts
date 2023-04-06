import { MapViewer2d } from "./mapViewer2d.js";

//drawBox();

const map = [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
  ];
  const viewer = new MapViewer2d(map);
  viewer.draw();