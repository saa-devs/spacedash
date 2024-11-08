/**
 * @fileoverview Defines the Shoot class, representing a single projectile fired by the player.
 * Manages the projectile's movement, firing behavior, and interactions with enemies.
 */

import Phaser from 'phaser';

/**
 * @class Shoot
 * @extends {Phaser.Physics.Arcade.Sprite}
 * @classdesc A projectile fired by the player, with properties to manage its speed, distance, and damage.
 * Includes methods for firing, handling hit interactions, and deactivating after reaching maximum distance.
 */
class Shoot extends Phaser.Physics.Arcade.Sprite {
    /**
     * Creates an instance of Shoot with specific settings for speed, scale, and damage.
     * @param {Phaser.Scene} scene - The scene this projectile belongs to.
     * @param {number} x - The initial x-coordinate of the projectile.
     * @param {number} y - The initial y-coordinate of the projectile.
     * @param {string} key - The texture key for the projectile sprite.
     */
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        scene.add.existing(this); // Add the projectile to the scene
        scene.physics.add.existing(this); // Enable physics for the projectile

        this.speed = 1000; // Set the speed at which the projectile moves
        this.setScale(4); // Scale up the projectile for better visibility
        this.maxDistance = 300; // Maximum distance the projectile can travel
        this.travelDistance = 0; // Track the distance traveled by the projectile

        this.damage = 1; // Amount of damage dealt by the projectile
    }

    /**
     * Updates the projectile's position each frame and deactivates it if it exceeds the max distance.
     * @param {number} time - The current time in the game loop.
     * @param {number} delta - The time elapsed since the last frame.
     */
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.travelDistance += this.body.deltaAbsX(); // Accumulate traveled distance

        if (this.travelDistance >= this.maxDistance) {
            this.activeShoot(false); // Deactivate the projectile if it exceeds max distance
        }
    }

    /**
     * Fires the projectile from the player's position, adjusting for direction and crouching state.
     * @param {Phaser.GameObjects.Sprite} player - The player character firing the projectile.
     * @param {boolean} isCrouching - Whether the player is crouching, affecting projectile height.
     */
    fire(player, isCrouching) {
        this.travelDistance = 0; // Reset travel distance when firing
        const offsetX = 30; // Horizontal offset from player
        let offsetY = -85; // Default vertical offset

        if (isCrouching) {
            offsetY = -55; // Adjust vertical offset if crouching
        }

        // Set projectile position and velocity based on player's facing direction
        if (player.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
            this.setPosition(player.x + offsetX, player.y + offsetY);
            this.setVelocityX(this.speed);
            this.setFlipX(false); // Ensure the projectile is not flipped when facing right
        } else {
            this.setPosition(player.x - offsetX, player.y + offsetY);
            this.setVelocityX(-this.speed);
            this.setFlipX(true); // Flip the projectile when facing left
        }

        this.activeShoot(true); // Activate and make the projectile visible
    }

    /**
     * Handles the event when the projectile hits an enemy, deactivating the projectile.
     * @param {Phaser.GameObjects.Sprite} enemy - The enemy hit by the projectile.
     */
    deliverHit(enemy) {
        this.activeShoot(false); // Deactivate the projectile upon impact
        this.body.reset(0, 0); // Reset its position to prevent further interaction
    }

    /**
     * Activates or deactivates the projectile, making it visible or invisible in the game.
     * @param {boolean} isActive - Whether the projectile should be active (true) or inactive (false).
     */
    activeShoot(isActive) {
        this.setActive(isActive); // Set active state
        this.setVisible(isActive); // Set visibility based on active state
    }
}

export default Shoot;