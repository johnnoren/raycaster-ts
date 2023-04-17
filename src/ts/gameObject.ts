export enum Status {
    Active,
    Inactive,
}

export interface GameObject {
    update(): void;

    render(gameCanvases: HTMLCanvasElement[], blockSize: number): void;

    get status(): Status;
}