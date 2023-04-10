export class MazeDebugger {
    addMazeToDocument(maze) {
        const cols = maze.length;
        this.draw(maze, cols);
    }
    draw(maze, cols) {
        const canvas = this.getNewCanvas();
        const context = canvas.getContext('2d');
        context.strokeRect(0, 0, canvas.width, canvas.height);
        const tileSize = canvas.width / cols;
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === 0) {
                    context.fillStyle = 'black';
                }
                else if (maze[y][x] === 1) {
                    context.fillStyle = 'white';
                }
                else {
                    context.fillStyle = 'black';
                }
                context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                context.fillStyle = 'red';
                context.font = "24px serif";
                context.fillText(`${maze[y][x]}`, x * tileSize + (tileSize / 2), y * tileSize + (tileSize / 2));
            }
        }
    }
    getNewCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 250;
        canvas.height = 250;
        const body = document.getElementsByTagName('body')[0];
        const div = document.createElement('div');
        div.appendChild(canvas);
        body.appendChild(div);
        return canvas;
    }
}
