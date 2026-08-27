// src/victus/index.ts
import { RendererFactory } from "./core/RendererFactory";
import { BaseRenderer } from "./core/BaseRenderer";

export class Victus {
    renderer: BaseRenderer;
    
    constructor(canvas: HTMLCanvasElement) {
        // Auto-detect best renderer
        this.renderer = RendererFactory.createOptimal(canvas);
        
        console.log(`[Victus] Using ${this.renderer.getType()} renderer`);
    }
    
    start() {
        // Rendering loop now uses BaseRenderer interface
    }
}
