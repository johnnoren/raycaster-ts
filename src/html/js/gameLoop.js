export class GameLoop {
    constructor(options) {
        this.sec = 1000;
        this.delta = 0;
        this.lag = 0;
        this.frameTime = 0;
        this.first = false;
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
    frame() {
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
    getFps() {
        return this.sec / this.frameTime;
    }
    getElapsedTime() {
        return (this.then - this.beginning) / this.sec;
    }
    setSlow(s) {
        this.slow = s;
        this.slowStep = this.slow * this.updateTimeStep;
    }
    getSlow() {
        return this.slow;
    }
}
