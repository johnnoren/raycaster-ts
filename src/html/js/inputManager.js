export class InputManager {
    constructor(player) {
        this.player = player;
        this.isArrowLeftPressed = false;
        this.isArrowRightPressed = false;
        this.isArrowUpPressed = false;
        this.isArrowDownPressed = false;
        this.setupEventListeners();
    }
    handleInput() {
        if (this.isArrowLeftPressed) {
            this.player.turnLeft();
        }
        if (this.isArrowRightPressed) {
            this.player.turnRight();
        }
        if (this.isArrowUpPressed) {
            this.player.moveForward();
        }
        if (this.isArrowDownPressed) {
            this.player.moveBackward();
        }
    }
    setupEventListeners() {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.isArrowLeftPressed = true;
                    break;
                case "ArrowRight":
                    this.isArrowRightPressed = true;
                    break;
                case "ArrowUp":
                    this.isArrowUpPressed = true;
                    break;
                case "ArrowDown":
                    this.isArrowDownPressed = true;
                    break;
                default:
                    break;
            }
        });
        document.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.isArrowLeftPressed = false;
                    break;
                case "ArrowRight":
                    this.isArrowRightPressed = false;
                    break;
                case "ArrowUp":
                    this.isArrowUpPressed = false;
                    break;
                case "ArrowDown":
                    this.isArrowDownPressed = false;
                    break;
                default:
                    break;
            }
        });
    }
}
