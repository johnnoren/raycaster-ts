export enum GameCanvasId {
    map,
    fov,
}

export class GameCanvas {
    constructor(public readonly id: GameCanvasId, public readonly canvas: HTMLCanvasElement) {}
}