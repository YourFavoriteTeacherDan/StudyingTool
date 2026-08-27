// Main Game Logic - ELGE Engine
import { Player } from './player.js';
import { World } from './world.js';

class Game {
    constructor() {
        this.player = new Player();
        this.world = new World();
        this.renderer = null; 
        this.running = false;
        this.lastTime = 0;
    }

    // Initialize with the Victus Renderer instance
    init(rendererInstance) {
        this.renderer = rendererInstance;
        console.log("ELGE Game Core Initialized");
    }

    start() {
        if (!this.running) {
            this.running = true;
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }

    stop() {
        this.running = false;
    }

    gameLoop(currentTime) {
        if (!this.running) return;

        // Calculate Delta Time (seconds)
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // 1. Process Input/Physics
        this.update(deltaTime);

        // 2. Render Scene
        if (this.renderer) {
            this.renderer.clear();
            this.renderer.renderWorld(this.world);
            this.renderer.renderPlayer(this.player);
        }

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(dt) {
        this.player.update(dt, this.world);
        this.world.update(dt);
    }
}

export default new Game();
