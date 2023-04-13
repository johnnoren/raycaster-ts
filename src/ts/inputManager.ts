import { Player } from "./player.js";

export class InputManager {
    private isArrowLeftPressed = false;
    private isArrowRightPressed = false;
    private isArrowUpPressed = false;
    private isArrowDownPressed = false;

    constructor(private player: Player) {
        this.setupEventListeners();
    }

    public handleInput(): void {
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

    private setupEventListeners(): void {
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