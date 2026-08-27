import { BaseRenderer } from '../core/BaseRenderer.ts';

export class SoftwareRenderer implements BaseRenderer {
    private ctx: CanvasRenderingContext2D;
    private imageData: ImageData;
    private buffer: Uint32Array;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Software rendering requires Canvas2D");
        this.ctx = ctx;
        this.imageData = this.ctx.createImageData(canvas.width, canvas.height);
        this.buffer = new Uint32Array(this.imageData.data.buffer);
    }

    clear(): void {
        this.buffer.fill(0xFF000000); // Fill with opaque black
    }

    // Manual pixel manipulation
    drawPixel(x: number, y: number, r: number, g: number, b: number): void {
        const index = y * this.imageData.width + x;
        this.buffer[index] = (255 << 24) | (b << 16) | (g << 8) | r;
    }

    present(): void {
        this.ctx.putImageData(this.imageData, 0, 0);
    }

    setViewport(x: number, y: number, w: number, h: number): void {}
}
