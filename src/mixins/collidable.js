/**
 * @fileoverview This mixin file defines collision behavior that can be reused and attached to game objects like players
 * and enemies. It provides methods to add colliders between objects and perform raycasting to detect terrain in front
 * of the object. The mixin enhances game objects with additional functionality for collision handling and raycasting.
 */
import Phaser from "phaser";

/**
 * A mixin that adds collision behavior to game objects, such as players and enemies.
 * Provides methods for adding colliders and performing raycasting for terrain detection.
 */
export default {
    /**
     * Adds a collision handler between this object and another game object.
     *
     * @param {Phaser.GameObjects.GameObject} otherGameObject - The object to collide with.
     * @param {Function} callback - The function to call when a collision happens.
     * @returns {Object} - Returns this object so you can chain methods.
     */
    addCollider(otherGameObject, callback) {
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
        return this; // Enables method chaining
    },

    bodyPositionDifferenceX: 0, // Tracks the change in the object's position on the x-axis since the last frame
    prevRay: null, // Stores the previous ray used for raycasting
    prevHasHit: null, // Stores the previous raycast result (whether it hit an object or not)

    /**
     * Casts a "ray" (like a laser beam) from the object to check if it hits the terrain.
     * Useful for checking if the object is about to fall or run into something.
     *
     * @param {Phaser.Physics.Arcade.Body} body - The body of the object to cast from.
     * @param {Phaser.Tilemaps.TilemapLayer} terrainColliderLayer - The layer to check for collisions.
     * @param {Object} options - Settings for how the ray behaves.
     * @param {number} [options.rayLength=90] - How far the ray should go.
     * @param {number} [options.precision=0] - How sensitive the raycasting is to position changes.
     * @param {number} [options.steepness=1] - The angle at which the ray is cast.
     * @returns {Object} - An object with the ray and a boolean indicating if it hit something.
     */
    rayCast(body, terrainColliderLayer, {
        rayLength = 90, precision = 0, steepness = 1
    }) {
        const { x, y, width, halfHeight } = body; // Get the body's current position and size
        this.bodyPositionDifferenceX += body.x - body.prev.x; // Track x-axis movement since the last frame

        // If the position difference is within the precision limit and there is a previous hit result, reuse the old data
        if ((Math.abs(this.bodyPositionDifferenceX) <= precision) && this.prevHasHit !== null) {
            return {
                ray: this.prevRay,
                hasHit: this.prevHasHit,
            };
        }

        const line = new Phaser.Geom.Line(); // Create a new ray (line) for the raycast
        let hasHit = false;

        // Cast the ray based on the object's facing direction (left or right)
        switch (body.facing) {
            case Phaser.Physics.Arcade.FACING_RIGHT: {
                line.x1 = x + width;
                line.y1 = y + halfHeight;
                line.x2 = line.x1 + rayLength * steepness;
                line.y2 = line.y1 + rayLength;
                break;
            }
            case Phaser.Physics.Arcade.FACING_LEFT: {
                line.x1 = x;
                line.y1 = y + halfHeight;
                line.x2 = line.x1 - rayLength * steepness;
                line.y2 = line.y1 + rayLength;
                break;
            }
        }

        // Check for collisions with tiles in the terrain layer along the ray
        const hits = terrainColliderLayer.getTilesWithinShape(line);

        // Determine if any tile along the ray is solid (index not -1)
        if (hits.length > 0) {
            hasHit = this.prevHasHit = hits.some(hit => hit.index !== -1);
        }

        // Store the current ray and reset position difference
        this.prevRay = line;
        this.bodyPositionDifferenceX = 0;

        // Return the ray and whether it hit a solid object
        return { ray: line, hasHit };
    }
}