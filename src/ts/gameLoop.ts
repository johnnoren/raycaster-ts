/* MIT License

Copyright (c) 2023 John Norén (port to TypeScript)
Copyright (c) 2016 Csaba Tuncsik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

export type GameLoopOptions = {
    updateTimeStep?: number;
    fpsFilterStrength?: number;
    slow?: number;
    update: (timeStep: number) => void;
    render: (lag: number) => void;
    input: () => void;
};

export class GameLoop {
    private sec: number = 1000;
    private updateTimeStep: number;
    private delta: number = 0;
    private lag: number = 0;
    private now: number;
    private then: number;
    private beginning: number;
    private fpsFilterStrength: number;
    private frameTime: number = 0;
    private first: boolean = false;
    private slow: number;
    private slowStep: number;
    private update: (timeStep: number) => void;
    private render: (lag: number) => void;
    private input: () => void;
    private rafId: number;

    constructor(options: GameLoopOptions) {
        this.updateTimeStep = options.updateTimeStep || this.sec / 30;
        this.fpsFilterStrength = options.fpsFilterStrength || 20;
        this.slow = options.slow || 1;
        this.slowStep = this.slow * this.updateTimeStep;
        this.update = options.update;
        this.render = options.render;
        this.input = options.input;
        this.now = performance.now();
        this.then = this.now;
        this.beginning = this.then;
    }

    private frame() {
        this.rafId = requestAnimationFrame(() => this.frame());
        this.input();
        this.now = performance.now();
        this.delta = this.now - this.then;
        this.then = this.now;
        this.lag += Math.min(this.sec, this.delta);
        while (this.lag >= this.slowStep) {
            this.lag -= this.slowStep;
            this.update(this.updateTimeStep);
        }
        this.frameTime += (this.delta - this.frameTime) / this.fpsFilterStrength;
        this.render(this.lag / this.slowStep);
    }

    start() {
        this.then = performance.now();
        if (!this.first) {
            this.first = true;
            this.beginning = this.then;
        }
        this.rafId = requestAnimationFrame(() => this.frame());
    }

    stop() {
        cancelAnimationFrame(this.rafId);
    }

    getFps(): number {
        return this.sec / this.frameTime;
    }

    getElapsedTime(): number {
        return (this.then - this.beginning) / this.sec;
    }

    setSlow(s: number) {
        this.slow = s;
        this.slowStep = this.slow * this.updateTimeStep;
    }

    getSlow(): number {
        return this.slow;
    }
}
