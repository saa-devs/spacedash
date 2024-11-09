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

        this.setScale(4);

        this.speed = 1000;
        this.maxDistance = 600;
        this.travelDistance = 0;

        this.damage = 1; // Amount of damage dealt by the projectile

        this.init();
        this.initEvents();
    }

    /**
     * Initialises the particle emitter for the projectile, creating a visual effect
     * that triggers upon firing or collision.
     * @method init
     * @memberof Shoot
     * @private
     */
    init() {
        this.emitter = this.scene.add.particles(this.x, this.y, 'beam-hit', {
            speed: {min: 150, max: 150},
            scale: {start: 3, end: 2},
            lifespan: 100,
            gravityY: 400,
            bounce: 1,
            quantity: 2,
            blendMode: 'NORMAL'
        });
        this.emitter.stop(); // Initially stop emitting particles
    }

    /** Sets up event listeners for the scene's update event. */
    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
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
            this.activeShoot(false);
            this.body.reset(0, 0);
            this.travelDistance = 0;
        }
    }

    /**
     * Fires the projectile from the player's position, adjusting for direction and crouching state.
     * @param {Phaser.GameObjects.Sprite} player - The player character firing the projectile.
     * @param facingRight - Whether the player is facing right, affecting projectile offsetX.
     * @param {boolean} isCrouching - Whether the player is crouching, affecting projectile offsetY.
     */
    fire(player, facingRight, isCrouching) {
        let offsetX = facingRight ? 35 : -50; // Adjust X offset based on direction
        let offsetY = isCrouching ? -55 : -85; // Adjust Y offset based on crouching

        this.activeShoot(true);
        this.travelDistance = 0; // Reset travel distance
        this.body.reset(player.x + offsetX, player.y + offsetY);

        // Set velocity and flip direction based on facingRight
        this.setVelocityX(facingRight ? Math.abs(this.speed) : -Math.abs(this.speed));
        this.setFlipX(!facingRight);
        this.body.enable = true;
    }


    /**
     * Handles the event when the projectile hits an enemy, deactivating the projectile.
     * @param {Phaser.GameObjects.Sprite} enemy - The enemy hit by the projectile.
     */
    deliverHit() {
        this.activeShoot(false); // Deactivate the projectile upon impact
        this.body.reset(0, 0); // Reset its position to prevent further interaction
        this.travelDistance = 0;
    }

    /**
     * Handles the collision event for the projectile.
     * Disables the projectile's active state and triggers a particle explosion effect at the collision point.
     */
    handleCollision() {
        this.activeShoot(false);
        this.emitter.explode(2, this.x, this.y); // Emit exactly 5 particles at collision point
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
