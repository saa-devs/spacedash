/**
 * @fileoverview Defines the Enemy class for handling enemy characters in the game.
 * The Enemy class includes movement, damage handling, and interaction with the player.
 */

import Phaser from 'phaser';
import collidable from '../mixins/collidable';
import animations from '../mixins/animations';

/**
 * @class Enemy
 * @extends {Phaser.Physics.Arcade.Sprite}
 * @classdesc Represents an enemy character in the game with patrol and follow-player behaviours.
 * Includes logic for taking damage and responding to player proximity.
 */
class Enemy extends Phaser.Physics.Arcade.Sprite {
    /**
     * Constructs an instance of Enemy with initial configuration, properties, and behaviours.
     * @param {Phaser.Scene} scene - The scene to which the enemy belongs.
     * @param {number} x - The initial x-coordinate for the enemy.
     * @param {number} y - The initial y-coordinate for the enemy.
     * @param {string} key - The texture key for the enemy sprite.
     * @param {Survivor} survivor - The player character that the enemy may follow.
     */
    constructor(scene, x, y, key, survivor) {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.config = scene.config;

        Object.assign(this, collidable);
        Object.assign(this, animations);

        this.init();
        this.initEvents();
        this.setSurvivor(survivor);

        this.health = 3; // Initial health of the enemy
        this.damage = 1; // Damage dealt to the player upon collision

        this.horizontalRayHeightOffset = 20; // Offset for horizontal raycasting
    }

    /** Initialises basic properties and physics settings for the enemy. */
    init() {
        this.terrainColliderLayer = null;
        this.survivor = null;

        this.gravity = 300;
        this.enemySpeed = 30;
        this.setVelocityX(this.enemySpeed);
        this.body.setGravityY(this.gravity);

        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        this.setScale(4);

        this.body.setSize(15, 26); // Set hitbox size
        this.body.setOffset(8, 6); // Adjust hitbox offset
        this.setOrigin(0.5, 1);

        this.turning = false; // Flag to control turning
        this.followDistance = 100; // Distance within which the enemy follows the player
        this.followVerticalDistance = 50; // Vertical distance within which the enemy follows the player
        this.stopDistance = 30; // Distance at which the enemy stops when close to the player
    }

    /** Sets up event listeners for the enemy. */
    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    /**
     * Sets the terrain collider layer to enable edge and wall detection.
     * @param {Phaser.Tilemaps.TilemapLayer} terrainColliderLayer - The terrain layer used for collision checks.
     */
    setTerrainColliders(terrainColliderLayer) {
        this.terrainColliderLayer = terrainColliderLayer;
    }

    /**
     * Sets the player character for the enemy to follow when in range.
     * @param {Survivor} survivor - The player character instance.
     */
    setSurvivor(survivor) {
        this.survivor = survivor;
    }

    /**
     * Updates the enemy's behaviour based on proximity to the player.
     * Switches between following the player and patrolling based on distance.
     * @param {number} time - The current time in the game loop.
     */
    update(time) {
        if (!this.terrainColliderLayer) return;

        const distanceToSurvivorX = Math.abs(this.survivor.x - this.x);
        const distanceToSurvivorY = Math.abs(this.survivor.y - this.y);

        if (distanceToSurvivorX < this.followDistance && distanceToSurvivorY < this.followVerticalDistance) {
            this.followPlayer();
        } else {
            this.patrolPlatform();
        }
    }

    /**
     * Causes the enemy to follow the player if within a specified range.
     * Adjusts speed and orientation based on proximity to the player.
     */
    followPlayer() {
        const direction = this.survivor.x < this.x ? -1 : 1;
        const distanceToSurvivorX = Math.abs(this.survivor.x - this.x);

        if (distanceToSurvivorX <= this.stopDistance) {
            this.setVelocityX(0);
        } else {
            this.setVelocityX(this.enemySpeed * direction);
        }

        this.flipX = direction === -1;
    }

    /**
     * Enables the enemy to patrol the platform, reversing direction at platform edges or walls.
     * Uses raycasting to detect edges and obstacles for smooth patrolling.
     */
    patrolPlatform() {
        if (this.turning) return;

        if (this.body.blocked.down) {
            const rayOriginX = this.flipX ? this.x - this.width / 2 - 20 : this.x + this.width / 2 + 1;
            const rayStartY = this.y + this.height / 2 - 15;
            const rayEndY = rayStartY + 20;
            const wallRayY = this.y - this.horizontalRayHeightOffset - 50;
            const horizontalRayLength = 40;
            const wallRayEndX = this.flipX ? this.x - this.width / 2 - horizontalRayLength : this.x + this.width / 2 + horizontalRayLength;

            const isPlatformAhead = this.terrainColliderLayer.getTileAtWorldXY(rayOriginX, rayEndY);
            const isWallAhead = this.terrainColliderLayer.getTileAtWorldXY(wallRayEndX, wallRayY);

            if (!isPlatformAhead || isWallAhead) {
                this.reverseDirection();
            }
        }
    }

    /**
     * Reverses the enemy's movement direction to avoid falling off platforms or hitting walls.
     * Adds a delay to avoid rapid turning.
     */
    reverseDirection() {
        this.turning = true;

        this.setVelocityX(-this.body.velocity.x);
        this.flipX = !this.flipX;

        this.scene.time.delayedCall(200, () => {
            this.turning = false;
        });
    }

    /**
     * Handles taking damage from a specified source and checks if health is depleted.
     * Deactivates enemy upon health reaching zero.
     * @param {object} source - The source object causing the damage (e.g., player projectile).
     */
    takeDamage(source) {
        source.deliverHit();
        this.health -= source.damage;
        source.setActive(false);
        source.setVisible(false);

        if (this.health <= 0) {
            this.setVelocity(0);
            this.body.setAllowGravity(false);
            this.body.setImmovable(true);
            this.body.checkCollision.none = true;
        }
    }
}

export default Enemy;