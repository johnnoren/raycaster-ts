import { GameObject, Status } from "./gameObject.js";
import { BlockType, Maze2d } from "./maze2dFactory.js";
import { Player, Vector2 } from "./player.js";

export class Ray implements GameObject {
  constructor(private player: Player, public status: Status, private map: Maze2d) {}

  update(): void {}

  render(canvas: HTMLCanvasElement): void {
    const context = canvas.getContext("2d");
    const { x: startX, y: startY } = this.player.position;
    const { x: dirX, y: dirY } = this.player.direction;

    
    const distanceToWall = this.getDistanceToWall(startX, startY, dirX, dirY, canvas);

    this.drawRay(context!, startX, startY, dirX, dirY, distanceToWall);
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
