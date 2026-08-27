import { BaseRenderer } from '../core/BaseRenderer.ts';

export class Canvas2DRenderer implements BaseRenderer {
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Canvas2D not supported");
        this.ctx = ctx;
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    setViewport(x: number, y: number, w: number, h: number): void {}
}
