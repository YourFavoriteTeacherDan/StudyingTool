import { WebGL2Renderer } from '../renderers/WebGL2Renderer.ts';
import { WebGL1Renderer } from '../renderers/WebGL1Renderer.ts';
import { SoftwareRenderer } from '../renderers/SoftwareRenderer.ts';
import { BaseRenderer } from './BaseRenderer.ts';

export class RendererFactory {
    static createOptimal(canvas: HTMLCanvasElement): BaseRenderer {
        try {
            if (!!window.WebGL2RenderingContext && canvas.getContext('webgl2')) {
                console.log("Victus: Initializing WebGL2 Renderer");
                return new WebGL2Renderer(canvas);
            }
        } catch (e) {
            console.warn("Victus: WebGL2 failed, falling back...");
        }

        try {
            const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl1) {
                console.log("Victus: Initializing WebGL1 Renderer (Legacy Mode)");
                return new WebGL1Renderer(canvas);
            }
        } catch (e) {
            console.warn("Victus: WebGL1 failed, falling back to Software...");
        }

        console.error("Victus: All GPU paths failed. Initializing Software Renderer.");
        return new SoftwareRenderer(canvas);
    }
}
