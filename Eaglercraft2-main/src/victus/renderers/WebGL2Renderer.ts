import { BaseRenderer } from '../core/BaseRenderer.ts';

export class WebGL2Renderer implements BaseRenderer {
    private gl: WebGL2RenderingContext;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('webgl2');
        if (!ctx) throw new Error("WebGL2 not supported");
        this.gl = ctx;
    }

    clear(): void {
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    setViewport(x: number, y: number, w: number, h: number): void {
        this.gl.viewport(x, y, w, h);
    }
}
