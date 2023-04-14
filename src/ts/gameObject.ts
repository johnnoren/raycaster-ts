import { GameCanvas } from "./gameCanvas";

export enum Status {
    Active,
    Inactive,
}

export interface GameObject {
    update(): void;

    render(gameCanvases: GameCanvas[]): void;

    get status(): Status;
}