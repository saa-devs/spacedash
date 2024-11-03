/**
 * @fileoverview A class representing an enemy character in the game. The enemy has basic walking and collision
 * behaviors, and can interact with the game's terrain.
 */

import Phaser from 'phaser';
import collidable from '../mixins/collidable';

class Enemy extends Phaser.Physics.Arcade.Sprite {
    /**
     * @constructor
     * @param {Phaser.Scene} scene - The scene this enemy belongs to.
     * @param {number} x - The x-coordinate of the enemy's initial position.
     * @param {number} y - The y-coordinate of the enemy's initial position.
     * @param {string} key - The key used to render the enemy sprite.
     */
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        /**
         * Adds collision properties and methods from the collidable mixin.
         */
        Object.assign(this, collidable);

        // Initial setup
        this.init();
        this.initEvents();
    }

    /**
     * Initialises the enemy's properties such as gravity, speed, size, and collision settings.
     */
    init() {
        // Physics
        this.gravity = 450;
        this.speed = 20;
        this.setVelocityX(this.speed);
        this.body.setGravityY(this.gravity);

        this.timeSinceLastTurn = 0;
        this.maxWalkDistance = 200;
        this.currentWalkDistance = 0;

        this.rayGraphics = this.scene.add.graphics({
            lineStyle: {
                width: 2, color: 0xaa00aa
            }
        });

        this.terrainColliderLayer = null;
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        this.setSize(8, 27);
        this.setScale(4);
        this.setOffset(12, 5);
        this.setOrigin(0.5, 1);
    }

    /**
     * Sets up event listeners for the enemy, particularly for the scene's update event.
     */
    initEvents() {
        // Listen for the scene's update event
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    /**
     * Called every frame to update the enemy's behavior.
     * @param {number} time - The current time in the game loop.
     */
    update(time) {
        this.enemyWalk(time);
    }

    /**
     * Handles the enemy's walking behavior and raycasting for terrain detection.
     * @param {number} time - The current time in the game loop.
     */
    enemyWalk(time) {
        // Ff the enemy doesn't exist or not on the floor, return as enemy should not walk in these cases
        if (!this.body || !this.body.onFloor()) {
            return;
        }

        // Tracks distance of how much enemy has walked
        this.currentWalkDistance += Math.abs(this.body.deltaX());

        // Returns a ray (the line), and whether the ray has hit something (the terrain)
        const {ray, hasHit} = this.rayCast(this.body, this.terrainColliderLayer, {
            rayLength: 90,
            precision: 1,
            steepness: 0.5
        });

        // If the enemy has not hit anything or has exceeded the maximum walking distance, turn the enemy around
        if ((!hasHit || this.currentWalkDistance >= this.maxWalkDistance)
            && this.timeSinceLastTurn + 100 < time) {
            this.setFlipX(!this.flipX);
            this.setVelocityX(this.speed = -this.speed);

            // Reset the timer and the walking distance so these can be tracked again
            this.timeSinceLastTurn = time;
            this.currentWalkDistance = 0;
        }

        this.rayGraphics.clear();
        this.rayGraphics.strokeLineShape(ray);
    }

    setTerrainColliders(terrainColliderLayer) {
        this.terrainColliderLayer = terrainColliderLayer;
    }
}

export default Enemy;