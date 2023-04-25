import { CanvasId } from "../game.js";
import { GameObject, Status } from "../gameObject.js";

export class Roof implements GameObject {

    constructor(public status: Status) { }

    update(): void {
        
    }
    render(canvases: HTMLCanvasElement[], _blockSize: number): void {
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

    private renderFov(canvas: HTMLCanvasElement): void {
        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const heightToDraw = height / 2;
        const colorStep = 150 / heightToDraw;
        let color = 150;

        for (let i = 0; i < heightToDraw; i++) {
            context!.fillStyle = 'rgba(' + color + ', ' + color + ', ' + color + ', 1)';
            context!.fillRect(0, i, width, 1);
            color -= colorStep;
        }
    }
    
}