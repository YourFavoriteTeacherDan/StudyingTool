export class Mat4 {
    public elements: Float32Array = new Float32Array(16);

    constructor() {
        this.identity();
    }

    identity(): this {
        this.elements.fill(0);
        this.elements[0] = 1; this.elements[5] = 1;
        this.elements[10] = 1; this.elements[15] = 1;
        return this;
    }

    static perspective(fov: number, aspect: number, near: number, far: number): Mat4 {
        const m = new Mat4();
        const f = 1.0 / Math.tan(fov / 2);
        m.elements[0] = f / aspect;
        m.elements[5] = f;
        m.elements[10] = (far + near) / (near - far);
        m.elements[11] = -1;
        m.elements[14] = (2 * far * near) / (near - far);
        m.elements[15] = 0;
        return m;
    }
}
