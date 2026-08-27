import { GLState } from "./GLState";

export class GLDevice {
    gl: WebGLRenderingContext | WebGL2RenderingContext;
    state: GLState;
    isWebGL2: boolean;

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
        this.gl = gl;
        this.isWebGL2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
        this.state = new GLState(gl);

        this.initDefaults();
    }

    initDefaults() {
        const gl = this.gl;
        gl.clearColor(0.05, 0.05, 0.08, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}
