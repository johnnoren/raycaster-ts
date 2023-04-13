export enum Status {
    Active,
    Inactive,
}

export interface GameObject {
    update(): void;

    render(canvas: HTMLCanvasElement): void;

    get status(): Status;
}