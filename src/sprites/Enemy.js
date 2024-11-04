/**
 * @fileoverview A class representing an enemy character in the game. The enemy can patrol platforms,
 * follow the player within a certain distance, and turn around at the edge of platforms.
 */

import Phaser from 'phaser';
import collidable from '../mixins/collidable';

class Enemy extends Phaser.Physics.Arcade.Sprite {
    /**
     * Creates an instance of the Enemy class.
     *
     * @param {Phaser.Scene} scene - The scene this enemy belongs to.
     * @param {number} x - The x-coordinate of the enemy's initial position.
     * @param {number} y - The y-coordinate of the enemy's initial position.
     * @param {string} key - The key used to render the enemy sprite.
     * @param {Phaser.GameObjects.Sprite} survivor - The player character that the enemy may follow.
     */
    constructor(scene, x, y, key, survivor) {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.config = scene.config;

        // Add collision properties and methods from the collidable mixin
        Object.assign(this, collidable);

        this.init();
        this.initEvents();
        this.setSurvivor(survivor);
    }

    /**
     * Initialises the enemy's properties such as gravity, speed, size, and collision settings.
     */
    init() {
        // Enemy physics
        this.gravity = 450;
        this.speed = 20;
        this.followSpeed = 40;
        this.setVelocityX(this.speed);
        this.body.setGravityY(this.gravity);

        // Walking behaviour
        this.detectionRange = 150;
        this.timeSinceLastTurn = 0;
        this.maxWalkDistance = 200;
        this.currentWalkDistance = 0;
        this.turnDelay = 500;

        this.damage = 1;

        /**
         * @property {Phaser.GameObjects.Graphics} rayGraphics - Graphics object used for debugging raycasting.
         */
        this.rayGraphics = this.scene.add.graphics({
            lineStyle: {
                width: 2, color: 0xaa00aa
            }
        });

        this.terrainColliderLayer = null;
        this.survivor = null;

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
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    /**
     * Called every frame to update the enemy's behavior.
     *
     * @param {number} time - The current time in the game loop.
     */
    update(time) {
        this.enemyWalk(time);
    }

    /**
     * Handles the enemy's walking behavior, turning at platform edges, and following the player if in range.
     *
     * @param {number} time - The current time in the game loop.
     */
    enemyWalk(time) {
        if (!this.body || !this.body.onFloor()) {
            return;
        }

        this.currentWalkDistance += Math.abs(this.body.deltaX());

        const {ray, hasHit} = this.rayCast(this.body, this.terrainColliderLayer, {
            rayLength: 90, precision: 1, steepness: 0.5
        });

        if ((!hasHit || this.currentWalkDistance >= this.maxWalkDistance) && (time - this.timeSinceLastTurn > this.turnDelay)) {
            this.flipDirection();
            this.timeSinceLastTurn = time;
            this.currentWalkDistance = 0;
        }

        if (this.survivor) {
            this.followSurvivor();
        }

        if (this.config.debug && ray) {
            this.rayGraphics.clear();
            this.rayGraphics.strokeLineShape(ray);
        }
    }

    /**
     * Flips the enemy's direction and reverses its speed.
     */
    flipDirection() {
        this.setFlipX(!this.flipX);
        this.speed = -this.speed;
        this.setVelocityX(this.speed);
    }

    /**
     * Makes the enemy follow the survivor if within detection range.
     */
    followSurvivor() {
        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.survivor.x, this.survivor.y);

        if (distanceToPlayer < this.detectionRange) {
            if (this.survivor.x < this.x) {
                this.setVelocityX(-this.followSpeed);
                this.setFlipX(true);
            } else {
                this.setVelocityX(this.followSpeed);
                this.setFlipX(false);
            }
        } else {
            this.setVelocityX(this.speed);
            this.setFlipX(this.speed < 0);
        }
    }

    /**
     * Sets the survivor (player) for the enemy to follow.
     *
     * @param {Phaser.GameObjects.Sprite} survivor - The player character.
     */
    setSurvivor(survivor) {
        this.survivor = survivor;
    }

    /**
     * Sets the terrain collider layer used for raycasting and collision detection.
     *
     * @param {object} terrainColliderLayer - The terrain layer for setting collision.
     * */
    setTerrainColliders(terrainColliderLayer) {
        this.terrainColliderLayer = terrainColliderLayer;
    }
}

export default Enemy;
