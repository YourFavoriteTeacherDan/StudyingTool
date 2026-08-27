import { VictusContext } from "../context/VictusContext";

export class RenderLoop {
    private ctx: VictusContext;
    private running = false;
    private lastTime = 0;

    constructor(ctx: VictusContext) {
        this.ctx = ctx;
    }

    start(): void {
        if (this.running) return;
        
        if (!this.ctx.isValid()) {
            console.error("[RenderLoop] Cannot start - Victus context is in fallback mode");
            return;
        }
        
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.frame);
    }

    stop(): void {
        this.running = false;
    }

    private frame = (time: number): void => {
        if (!this.running) return;

        const delta = time - this.lastTime;
        this.lastTime = time;

        this.tick(delta);
        this.render();

        requestAnimationFrame(this.frame);
    };

    private tick(delta: number): void {
        // Logic updates (ELGE will hook here)
    }

    private render(): void {
        if (this.ctx.device) {
            this.ctx.device.clear();
        }
        // Rendering commands will go here
    }
}
