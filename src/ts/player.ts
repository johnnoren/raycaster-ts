export type Position = { x: number; y: number; }
export type Vector2 = { x: number; y: number; }

export class Player {
    constructor(public position: Position, public direction: Vector2) {}

    public drawPlayer(context: CanvasRenderingContext2D, tileSize: number): void {
        const { x, y } = this.position;
        const radius = 10;
        const halfTileSize = tileSize / 2;
      
        context.beginPath();
        context.arc(x * tileSize + halfTileSize, y * tileSize + halfTileSize, radius, 0, Math.PI * 2);
        context.fillStyle = 'red';
        context.fill();
        context.closePath();
      }
      
}
