import { GameObject, Status } from "./gameObject.js";
import { Player, Vector2 } from "./player.js";

export class Ray implements GameObject {
  constructor(private player: Player, public status: Status) {}

  update(): void {}

  render(canvas: HTMLCanvasElement): void {
    const context = canvas.getContext("2d");
    const { x: startX, y: startY } = this.player.position;
    const { x: dirX, y: dirY } = this.player.direction;

    context!.beginPath();
    context!.moveTo(startX, startY);
    context!.lineTo(startX + dirX * 50, startY + dirY * 50);
    context!.strokeStyle = "red";
    context!.stroke();
  }
}
