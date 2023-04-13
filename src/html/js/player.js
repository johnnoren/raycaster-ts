export class Player {
    constructor(position, direction, status) {
        this.position = position;
        this.direction = direction;
        this.status = status;
    }
    update() {
    }
    render(canvas) {
        const { x, y } = this.position;
        const context = canvas.getContext('2d');
        const radius = 5;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = 'green';
        context.fill();
        context.closePath();
    }
}
