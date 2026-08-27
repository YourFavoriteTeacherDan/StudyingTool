export class Vec3 {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

    set(x: number, y: number, z: number): this {
        this.x = x; this.y = y; this.z = z;
        return this;
    }

    add(v: Vec3): Vec3 {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    multiplyScalar(s: number): Vec3 {
        return new Vec3(this.x * s, this.y * s, this.z * s);
    }

    dot(v: Vec3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    length(): number {
        return Math.sqrt(this.dot(this));
    }

    normalize(): Vec3 {
        const len = this.length();
        return len > 0 ? this.multiplyScalar(1 / len) : new Vec3();
    }
}
