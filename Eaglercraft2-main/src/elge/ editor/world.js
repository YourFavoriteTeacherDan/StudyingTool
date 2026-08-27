// World Management - ELGE Engine
export class World {
    constructor() {
        this.chunks = new Map();
        this.entities = [];
        this.modifiedBlocks = new Set();
        this.time = 0;
    }

    update(dt) {
        this.time += dt;
        
        // Update dynamic entities (mobs, particles, etc.)
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const entity = this.entities[i];
            if (entity.shouldRemove) {
                this.entities.splice(i, 1);
            } else {
                entity.update(dt);
            }
        }
    }

    // Standard Voxel Helper
    setBlock(x, y, z, blockID) {
        const key = `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`;
        this.chunks.set(key, blockID);
        this.modifiedBlocks.add(key);
    }

    getBlock(x, y, z) {
        const key = `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`;
        return this.chunks.get(key) || 0; // 0 is Air
    }

    spawnEntity(entity) {
        this.entities.push(entity);
        console.log(`Spawned entity: ${entity.type}`);
    }

    // Clean up world data for memory management on low-end PCs
    optimize() {
        if (this.chunks.size > 10000) {
            // Logic to unload distant chunks
            console.log("ELGE: Optimizing world memory...");
        }
    }
}
