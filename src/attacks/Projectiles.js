/**
 * @fileoverview Defines the Projectiles class, which manages a pool of projectile instances.
 * This class is responsible for creating, managing, and firing projectiles in the game.
 */

import Phaser from "phaser";
import Shoot from './Shoot';

/**
 * @class Projectiles
 * @extends {Phaser.Physics.Arcade.Group}
 * @classdesc A group class for managing multiple projectile instances. Provides functionality to
 * create and fire projectiles from the player's position.
 */
class Projectiles extends Phaser.Physics.Arcade.Group {
    /**
     * Creates an instance of Projectiles, initializing a pool of inactive projectiles.
     * @param {Phaser.Scene} scene - The scene this group of projectiles belongs to.
     */
    constructor(scene) {
        super(scene.physics.world, scene);

        // Create a pool of 5 projectile instances that are initially inactive and invisible
        this.createMultiple({
            frameQuantity: 5,
            active: false,
            visible: false,
            key: 'beam', // Key for the projectile texture
            classType: Shoot // Class type for each projectile instance
        });
    }

    /**
     * Fires a projectile from the player's position. If the player is crouching, the projectile
     * behavior may adjust accordingly.
     *
     * @param {Phaser.GameObjects.Sprite} player - The player character firing the projectile.
     * @param {boolean} isCrouching - Whether the player is crouching, affecting the projectile's behavior.
     */
    fireProjectile(player, isCrouching) {
        const projectile = this.getFirstDead(false); // Get an inactive projectile from the pool
        if (!projectile) return; // If no inactive projectile is available, exit

        // Fire the projectile from the player's position
        projectile.fire(player, isCrouching);
    }
}

export default Projectiles;