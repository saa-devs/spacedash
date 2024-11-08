import Phaser from 'phaser';
import Collectable from '../sprites/Collectable';

/**
 * Represents a group of collectable items in the game, extending Phaser's StaticGroup.
 *
 * This class creates a static group for collectable items, such as coins or other items
 * that the player can collect. The group uses `Collectable` as the class type for its items.
 *
 * @class Collectables
 * @extends Phaser.Physics.Arcade.StaticGroup
 */
class Collectables extends Phaser.Physics.Arcade.StaticGroup {
    /**
     * Creates an instance of the Collectables group.
     *
     * @param {Phaser.Scene} scene - The scene to which this group belongs.
     */
    constructor(scene) {
        super(scene.physics.world, scene);
        this.createFromConfig({
            classType: Collectable
        });
    }
}

export default Collectables;