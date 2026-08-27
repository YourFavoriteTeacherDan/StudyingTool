// src/victus/core/BaseRenderer.ts

import { Vec3 } from "../math/Vec3";
import { Mat4 } from "../math/Mat4";
import { Color } from "../math/Color";

export interface RendererCapabilities {
    maxTextureSize: number;
    maxDrawCalls: number;
    supportsInstancing: boolean;
    supportsFloatTextures: boolean;
    maxLights: number;
}

export interface Mesh {
    vertices: Float32Array;
    indices?: Uint16Array | Uint32Array;
    normals?: Float32Array;
    uvs?: Float32Array;
    colors?: Float32Array;
}

export interface Texture {
    id: string;
    width: number;
    height: number;
    data?: ImageData | HTMLImageElement;
}

export interface Shader {
    id: string;
    vertexSource: string;
    fragmentSource: string;
}

export interface Buffer {
    id: string;
    data: Float32Array | Uint16Array | Uint32Array;
    type: 'vertex' | 'index';
}

export enum BlendMode {
    NONE = 'none',
    ALPHA = 'alpha',
    ADDITIVE = 'additive',
    MULTIPLY = 'multiply'
}

export enum CullMode {
    NONE = 'none',
    FRONT = 'front',
    BACK = 'back'
}

export interface RenderStats {
    fps: number;
    frameTime: number;
    drawCalls: number;
    triangles: number;
    vertices: number;
}

/**
 * Base interface all renderers must implement
 */
export abstract class BaseRenderer {
    protected canvas: HTMLCanvasElement;
    protected width: number = 0;
    protected height: number = 0;
    protected stats: RenderStats = {
        fps: 0,
        frameTime: 0,
        drawCalls: 0,
        triangles: 0,
        vertices: 0
    };
    
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.resize();
    }
    
    // ===== Core Rendering =====
    
    /**
     * Clear the screen
     */
    abstract clear(color?: Color): void;
    
    /**
     * Set the viewport
     */
    abstract setViewport(x: number, y: number, width: number, height: number): void;
    
    /**
     * Resize the renderer
     */
    resize(): void {
        const dpr = window.devicePixelRatio || 1;
        this.width = this.canvas.clientWidth * dpr;
        this.height = this.canvas.clientHeight * dpr;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    // ===== Mesh Rendering =====
    
    /**
     * Draw a mesh with transformation
     */
    abstract drawMesh(mesh: Mesh, transform: Mat4, color?: Color): void;
    
    /**
     * Draw multiple instances of a mesh (if supported)
     */
    drawMeshInstanced?(mesh: Mesh, transforms: Mat4[], colors?: Color[]): void;
    
    // ===== Primitive Rendering =====
    
    /**
     * Draw a triangle
     */
    abstract drawTriangle(v1: Vec3, v2: Vec3, v3: Vec3, color: Color): void;
    
    /**
     * Draw a line
     */
    abstract drawLine(start: Vec3, end: Vec3, color: Color, width?: number): void;
    
    /**
     * Draw a point
     */
    abstract drawPoint(pos: Vec3, size: number, color: Color): void;
    
    /**
     * Draw a quad (two triangles)
     */
    drawQuad(v1: Vec3, v2: Vec3, v3: Vec3, v4: Vec3, color: Color): void {
        this.drawTriangle(v1, v2, v3, color);
        this.drawTriangle(v1, v3, v4, color);
    }
    
    // ===== State Management =====
    
    /**
     * Set blend mode
     */
    abstract setBlendMode(mode: BlendMode): void;
    
    /**
     * Enable/disable depth testing
     */
    abstract setDepthTest(enabled: boolean): void;
    
    /**
     * Set face culling mode
     */
    abstract setCullFace(mode: CullMode): void;
    
    // ===== Resource Management =====
    
    /**
     * Create a texture from image data
     */
    abstract createTexture(data: ImageData | HTMLImageElement): Texture;
    
    /**
     * Create a shader program
     */
    abstract createShader(vertexSource: string, fragmentSource: string): Shader;
    
    /**
     * Create a vertex/index buffer
     */
    abstract createBuffer(data: Float32Array | Uint16Array | Uint32Array, type: 'vertex' | 'index'): Buffer;
    
    /**
     * Destroy a texture
     */
    abstract destroyTexture(texture: Texture): void;
    
    /**
     * Destroy a shader
     */
    abstract destroyShader(shader: Shader): void;
    
    /**
     * Destroy a buffer
     */
    abstract destroyBuffer(buffer: Buffer): void;
    
    // ===== Camera =====
    
    /**
     * Set view matrix (camera transform)
     */
    abstract setViewMatrix(matrix: Mat4): void;
    
    /**
     * Set projection matrix (perspective/orthographic)
     */
    abstract setProjectionMatrix(matrix: Mat4): void;
    
    // ===== Stats & Info =====
    
    /**
     * Get current rendering statistics
     */
    getStats(): RenderStats {
        return { ...this.stats };
    }
    
    /**
     * Reset frame statistics
     */
    resetStats(): void {
        this.stats.drawCalls = 0;
        this.stats.triangles = 0;
        this.stats.vertices = 0;
    }
    
    /**
     * Get renderer capabilities
     */
    abstract getCapabilities(): RendererCapabilities;
    
    /**
     * Get renderer type name
     */
    abstract getType(): string;
}
