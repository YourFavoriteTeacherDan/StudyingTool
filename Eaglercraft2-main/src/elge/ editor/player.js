// Player Controller - ELGE Engine
export class Player {
    constructor() {
        this.position = { x: 0, y: 5, z: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 }; // Pitch and Yaw
        this.settings = {
            speed: 5,
            jumpForce: 8,
            gravity: 20,
            eyeHeight: 1.6
        };
        this.isGrounded = false;
    }

    update(dt, world) {
        // Apply Gravity
        if (!this.isGrounded) {
            this.velocity.y -= this.settings.gravity * dt;
        }

        // Apply Velocity to Position
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.position.z += this.velocity.z * dt;

        // Simple Ground Collision (Y=0 for now)
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocity.y = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }

        // Apply Friction/Damping to horizontal movement
        this.velocity.x *= 0.9;
        this.velocity.z *= 0.9;
    }

    move(direction) {
        // Calculate movement based on rotation (Yaw)
        const yaw = this.rotation.y;
        if (direction === 'forward') {
            this.velocity.x -= Math.sin(yaw) * this.settings.speed;
            this.velocity.z -= Math.cos(yaw) * this.settings.speed;
        }
        if (direction === 'backward') {
            this.velocity.x += Math.sin(yaw) * this.settings.speed;
            this.velocity.z += Math.cos(yaw) * this.settings.speed;
        }
    }

    jump() {
        if (this.isGrounded) {
            this.velocity.y = this.settings.jumpForce;
            this.isGrounded = false;
        }
    }
}
