/**
 * @fileoverview Defines the Undead enemy type, a specific enemy class that extends the base Enemy class.
 * Adds custom behavior and animations specific to the Undead enemy type.
 */

import Enemy from './Enemy';
import initAnimations from "../animations/undeadAnimations";
import Phaser from "phaser";

/**
 * @class Undead
 * @extends {Enemy}
 * @classdesc A type of enemy that inherits common enemy properties and behaviors from the Enemy superclass.
 * The Undead has custom animations and takes damage with specific animations.
 */
class Undead extends Enemy {
    /**
     * Creates an instance of Undead, initialising it with specific properties and animations.
     * @param {Phaser.Scene} scene - The scene to which this Undead enemy belongs.
     * @param {number} x - The x-coordinate of the enemy's starting position.
     * @param {number} y - The y-coordinate of the enemy's starting position.
     * @param {Phaser.GameObjects.Sprite} survivor - The player character to follow or target.
     */
    constructor(scene, x, y, survivor) {
        super(scene, x, y, 'undead', survivor); // Call the Enemy constructor with Undead-specific parameters
        scene.add.existing(this); // Add the undead enemy sprite to the scene
        scene.physics.add.existing(this); // Enable physics for the undead enemy
        initAnimations(this.scene.anims); // Initialise animations specific to the Undead type

        this.isDead = false; // Track if the enemy is dead
    }

    /**
     * Updates the enemy's behavior each frame, including animations and movement.
     * Stops updating if the Undead is dead.
     * @param {number} time - The current time in the game loop.
     */
    update(time) {
        if (this.isDead) return; // Stop all updates if the Undead is dead
        super.update(time); // Call the parent class's update method

        // Check if the enemy is playing any specific animations related to being hurt, hit, or dying
        if (this.isPlayingAnims('undead-hurt')
            || this.isPlayingAnims('undead-hit')
            || this.isPlayingAnims('undead-die')) {
            return; // Skip further animations if one of these is active
        }

        this.play('undead-idle', true); // Play idle animation by default
    }

    /**
     * Reduces the Undead's health when it takes damage and handles death animation.
     * @param {object} source - The object that dealt the damage.
     */
    takeDamage(source) {
        if (this.isDead) return; // Prevent taking damage if already dead
        super.takeDamage(source); // Call the parent class's takeDamage method
        this.play('undead-hurt', true); // Play hurt animation when taking damage

        // Check if health is zero or below to trigger the death sequence
        if (this.health <= 0) {
            this.play('undead-die', true); // Play the death animation

            // Once the death animation completes, set the Undead to its final frame and mark it as inactive
            this.once('animationcomplete-undead-die', () => {
                this.setFrame(29); // Set to the last frame of the death animation
                this.setActive(false); // Deactivate the enemy in the game
                this.isDead = true; // Mark the enemy as dead
            });
        }
    }
}

export default Undead;