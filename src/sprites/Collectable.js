// Collectable.js
import Phaser from 'phaser';
import blueCoinAnimation from '../animations/blueCoinAnimation';

/**
 * Represents a collectable item in the game, such as a coin.
 *
 * This class extends Phaser's `Arcade.Sprite` and includes custom properties and animations
 * for collectable items. When created, it is added to the scene, scaled, and assigned a default score.
 * The class also registers and plays the 'spin' animation for the item.
 *
 * @class Collectable
 * @extends Phaser.Physics.Arcade.Sprite
 */
class Collectable extends Phaser.Physics.Arcade.Sprite {
    /**
     * Creates an instance of a collectable item.
     *
     * @param {Phaser.Scene} scene - The scene to which this collectable belongs.
     * @param {number} x - The x-coordinate of the collectable's position.
     * @param {number} y - The y-coordinate of the collectable's position.
     * @param {string} key - The texture key for the collectable.
     */
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        // Add this collectable to the scene
        scene.add.existing(this);

        // Set scale and other properties
        this.setScale(2);
        this.score = 1;

        // Register and play the 'spin' animation
        blueCoinAnimation(scene.anims);  // Ensure the animation is created
        this.play('spin');               // Now play the animation
    }
}

export default Collectable;