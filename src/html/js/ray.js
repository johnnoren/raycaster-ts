export class Ray {
    constructor(player, status) {
        this.player = player;
        this.status = status;
    }
    update() { }
    render(canvas) {
        const context = canvas.getContext("2d");
        const { x: startX, y: startY } = this.player.position;
        const { x: dirX, y: dirY } = this.player.direction;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + dirX * 50, startY + dirY * 50);
        context.strokeStyle = "red";
        context.stroke();
    }
}
