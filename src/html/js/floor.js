import { CanvasId } from "./game.js";
export class Floor {
    constructor(status) {
        this.status = status;
    }
    update() {
    }
    render(canvases, _blockSize) {
        canvases.forEach((canvas) => {
            switch (canvas.id) {
                case CanvasId.map:
                    break;
                case CanvasId.fov:
                    this.renderFov(canvas);
                    break;
                default: throw new Error("CanvasId not implemented: " + canvas.id);
            }
        });
    }
    renderFov(canvas) {
        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const heightToDraw = height / 2;
        const colorStep = 100 / heightToDraw;
        let color = 0;
        const startPositionY = heightToDraw;
        for (let i = 0; i < heightToDraw; i++) {
            context.fillStyle = 'rgba(' + color + ', ' + color + ', ' + color + ', 1)';
            context.fillRect(0, startPositionY + i, width, 1);
            color += colorStep;
        }
    }
}
