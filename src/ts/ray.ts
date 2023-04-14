import { GameObject, Status } from "./gameObject.js";
import { BlockType, Maze2d } from "./maze2dFactory.js";
import { Player, Vector2 } from "./player.js";

export class Ray implements GameObject {
  constructor(private player: Player, public status: Status, private map: Maze2d, private angle: number) {}

  update(): void {}

  render(canvas: HTMLCanvasElement): void {
    const context = canvas.getContext("2d");
    const { x: startX, y: startY } = this.player.position;
    const { x: dirX, y: dirY } = this.player.direction;

    // Calculate the direction of the ray, offset by the angle
    const cos = Math.cos(this.angle);
    const sin = Math.sin(this.angle);
    const dirXOffset = dirX * cos - dirY * sin;
    const dirYOffset = dirX * sin + dirY * cos;

    // Find the distance to the nearest wall in the direction of the ray
    const distanceToWall = this.getDistanceToWall(startX, startY, dirXOffset, dirYOffset, canvas);

    // Draw the ray on the canvas
    this.drawRay(context!, startX, startY, dirXOffset, dirYOffset, distanceToWall);
  }

  private drawRay(context: CanvasRenderingContext2D, startX: number, startY: number, dirX: number, dirY: number, distance: number): void {
    context!.beginPath();
    context!.moveTo(startX, startY);
    context!.lineTo(startX + dirX * distance, startY + dirY * distance);
    context!.strokeStyle = "red";
    context!.stroke();
  }

  private getDistanceToWall(startX: number, startY: number, dirX: number, dirY: number, canvas: HTMLCanvasElement): number {
    let distance = 0;
    let hitWall = false;
    while (!hitWall && distance < canvas.width) {
      const x = startX + dirX * distance;
      const y = startY + dirY * distance;
      if (this.map.isBlockType({ x, y }, BlockType.Wall)) {
        hitWall = true;
      } else {
        distance++;
      }
    }
    return distance;
  }
}
