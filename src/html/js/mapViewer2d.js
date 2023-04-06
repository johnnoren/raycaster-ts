export class MapViewer2d {
    constructor(map) {
        this.map = map;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 500;
        this.canvas.height = 500;
        const box = document.getElementById('box');
        box.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');
        box.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
    }
    draw() {
        const tileSize = this.canvas.width / this.map.length;
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                if (this.map[i][j] === 0) {
                    this.context.fillStyle = 'white';
                }
                else if (this.map[i][j] === 1) {
                    this.context.fillStyle = 'black';
                }
                else {
                    throw new Error(`Invalid value in map: ${this.map[i][j]}`);
                }
                this.context.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
            }
        }
    }
}
