import { GLDevice } from "../gl/GLDevice";

export class VictusContext {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext | WebGL2RenderingContext | null;
    device: GLDevice | null;
    fallbackMode: boolean;
    errorMessage: string | null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.fallbackMode = false;
        this.errorMessage = null;
        this.gl = null;
        this.device = null;

        try {
            // Try WebGL2 first
            const gl2 = canvas.getContext("webgl2", {
                failIfMajorPerformanceCaveat: false,
                antialias: false,
                depth: true,
                stencil: false,
                preserveDrawingBuffer: false,
                powerPreference: "high-performance"
            });

            if (gl2) {
                this.gl = gl2;
                this.device = new GLDevice(this.gl);
            } else {
                // Fallback to WebGL1 with relaxed settings
                const gl1 = canvas.getContext("webgl", {
                    failIfMajorPerformanceCaveat: false,
                    antialias: false,
                    depth: true,
                    stencil: false,
                    preserveDrawingBuffer: false,
                    alpha: false
                }) || canvas.getContext("experimental-webgl", {
                    failIfMajorPerformanceCaveat: false,
                    antialias: false,
                    depth: true
                });

                if (gl1) {
                    this.gl = gl1;
                    this.device = new GLDevice(this.gl);
                } else {
                    throw new Error("WebGL not supported");
                }
            }

            this.resize();
            window.addEventListener("resize", () => this.resize());
        } catch (error) {
            console.error("[Victus] WebGL initialization failed:", error);
            this.fallbackMode = true;
            this.errorMessage = this.buildErrorMessage(error);
            this.setupFallbackRenderer();
        }
    }

    private buildErrorMessage(error: any): string {
        const message = error?.message || "Unknown error";
        
        // Check for specific hardware issues
        if (message.includes("DEVICE = 0x0116")) {
            return "Intel HD Graphics 3000 detected. This GPU only supports Direct3D 9, which is incompatible with modern WebGL. Please try:\n\n" +
                   "1. Update your graphics drivers\n" +
                   "2. Try a different browser (Firefox may work better)\n" +
                   "3. Enable hardware acceleration in browser settings\n" +
                   "4. Use a device with newer GPU (Intel HD 4000 or newer)";
        }
        
        if (message.includes("Could not create a WebGL context")) {
            return "WebGL initialization failed. Your GPU or browser may not support WebGL.\n\n" +
                   "Troubleshooting steps:\n" +
                   "1. Update graphics drivers\n" +
                   "2. Try Chrome, Firefox, or Edge\n" +
                   "3. Enable hardware acceleration\n" +
                   "4. Check if your GPU is blacklisted";
        }

        return `WebGL Error: ${message}`;
    }

    private setupFallbackRenderer(): void {
        const ctx = this.canvas.getContext("2d");
        if (!ctx) {
            console.error("[Victus] Cannot create 2D fallback context");
            return;
        }

        // Draw error message on canvas
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        ctx.fillStyle = "#ff6b6b";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("WebGL Not Supported", this.canvas.width / 2, 100);
        
        ctx.fillStyle = "#f0f0f0";
        ctx.font = "16px Arial";
        
        const lines = this.errorMessage?.split("\n") || [];
        let y = 150;
        for (const line of lines) {
            ctx.fillText(line, this.canvas.width / 2, y);
            y += 25;
        }
    }

    resize(): void {
        if (this.fallbackMode || !this.gl) return;

        const dpr = window.devicePixelRatio || 1;
        const width = this.canvas.clientWidth * dpr;
        const height = this.canvas.clientHeight * dpr;

        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
    }

    isValid(): boolean {
        return !this.fallbackMode && this.gl !== null && this.device !== null;
    }
}
