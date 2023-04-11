export class Player {
    constructor(position, direction) {
        this.position = position;
        this.direction = direction;
    }
    drawPlayer(context, tileSize) {
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
