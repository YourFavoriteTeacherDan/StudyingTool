import { BaseRenderer } from '../core/BaseRenderer.ts';

export class WebGL1Renderer implements BaseRenderer {
    private gl: WebGLRenderingContext;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!ctx) throw new Error("WebGL1 not supported");
        this.gl = ctx as WebGLRenderingContext;
    }

    clear(): void {
        this.gl.clearColor(0.1, 0.1, 0.1, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    setViewport(x: number, y: number, w: number, h: number): void {
        this.gl.viewport(x, y, w, h);
    }
}
