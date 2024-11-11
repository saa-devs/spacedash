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

    /**
     * Maps properties from a properties list to an object.
     *
     * @param {Array<Object>} propertiesList - List of properties, each with `name` and `value` keys.
     * @returns {Object} Mapped properties as key-value pairs, or an empty object if propertiesList is invalid.
     */
    mapProperties(propertiesList) {
        if (!Array.isArray(propertiesList) || propertiesList.length === 0) {
            return {};
        }
        return propertiesList.reduce((map, object) => {
            map[object.name] = object.value;
            return map;
        }, {});
    }

    /**
     * Adds collectable items to the group based on the data from a tilemap layer.
     *
     * @param collectablesLayer - The layer containing collectable object data.
     * @param {number} scaleFactor - Scaling factor for positioning items within the layer.
     */
    addFromLayer(collectablesLayer, scaleFactor) {
        const {score: defaultScore, type} = this.mapProperties(collectablesLayer.properties);

        collectablesLayer.objects.forEach((collectableObject) => {
            const offsetY = 40;
            const startX = collectableObject.x * scaleFactor;
            const startY = collectableObject.y * scaleFactor + offsetY;
            const collectable = this.get(startX, startY, type);
            const properties = this.mapProperties(collectableObject.properties);
            collectable.score = properties.score || defaultScore;
        });
    }
}

export default Collectables;