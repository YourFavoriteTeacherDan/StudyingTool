export class GLState {
    private gl: WebGLRenderingContext | WebGL2RenderingContext;

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
        this.gl = gl;
    }

    enableDepthTest(enable: boolean) {
        if (enable) this.gl.enable(this.gl.DEPTH_TEST);
        else this.gl.disable(this.gl.DEPTH_TEST);
    }

    enableCullFace(enable: boolean) {
        if (enable) this.gl.enable(this.gl.CULL_FACE);
        else this.gl.disable(this.gl.CULL_FACE);
    }
}
