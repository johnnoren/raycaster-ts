export var GameCanvasId;
(function (GameCanvasId) {
    GameCanvasId[GameCanvasId["map"] = 0] = "map";
    GameCanvasId[GameCanvasId["fov"] = 1] = "fov";
})(GameCanvasId || (GameCanvasId = {}));
export class GameCanvas {
    constructor(id, canvas) {
        this.id = id;
        this.canvas = canvas;
    }
}
