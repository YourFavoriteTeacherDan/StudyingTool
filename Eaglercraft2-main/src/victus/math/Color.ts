export class Color {
    constructor(
        public r: number = 1,
        public g: number = 1,
        public b: number = 1,
        public a: number = 1
    ) {}

    toCSS(): string {
        return `rgba(${this.r * 255}, ${this.g * 255}, ${this.b * 255}, ${this.a})`;
    }

    static fromHex(hex: string): Color {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return new Color(r, g, b, 1);
    }
}
