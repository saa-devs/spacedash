/**
 * @fileoverview The Enemy superclass that provides common properties and methods for enemy characters.
 * This class sets up basic behaviors for enemies, such as movement, animations, and collision handling.
 */

import Phaser from 'phaser';
import collidable from '../mixins/collidable';
import animations from '../mixins/animations';

/**
 * @class Enemy
 * @extends {Phaser.Physics.Arcade.Sprite}
 * @classdesc Base class for all enemy types in the game. Manages common properties such as movement, damage,
 * and animations. This class is intended to be extended by specific enemy types (e.g., Undead).
 */
class Enemy extends Phaser.Physics.Arcade.Sprite {
    /**
     * Constructs the Enemy instance and initializes properties.
     * @param {Phaser.Scene} scene - The scene to which this enemy belongs.
     * @param {number} x - The x-coordinate of the enemy's starting position.
     * @param {number} y - The y-coordinate of the enemy's starting position.
     * @param {string} key - The texture key for the enemy sprite.
     * @param {Phaser.GameObjects.Sprite} survivor - The player character to follow.
     */
    constructor(scene, x, y, key, survivor) {
        super(scene, x, y, key);

        scene.add.existing(this); // Add enemy sprite to the scene
        scene.physics.add.existing(this); // Enable physics for the enemy
        this.config = scene.config; // Game config for easy access

        // Add collision properties and methods from mixins
        Object.assign(this, collidable);
        Object.assign(this, animations);

        // Initialise enemy properties and set survivor target
        this.init();
        this.initEvents();
        this.setSurvivor(survivor);
    }

    /**
     * Initializes the enemy's properties such as gravity, speed, size, and collision settings.
     */
    init() {
        // Set up enemy physics properties
        this.gravity = 450;
        this.speed = 20;
        this.followSpeed = 40;
        this.setVelocityX(this.speed);
        this.body.setGravityY(this.gravity);

        // Walking behavior parameters
        this.detectionRange = 150;
        this.timeSinceLastTurn = 0;
        this.maxWalkDistance = 200;
        this.currentWalkDistance = 0;
        this.turnDelay = 500;

        // Damage and health properties
        this.damage = 1;
        this.health = 3;

        /**
         * @property {Phaser.GameObjects.Graphics} rayGraphics - Graphics object used for debugging raycasting.
         */
        this.rayGraphics = this.scene.add.graphics({
            lineStyle: {
                width: 2,
                color: 0xaa00aa
            }
        });

        this.terrainColliderLayer = null; // Layer used for terrain collision checks
        this.survivor = null; // Player reference for enemy to follow

        // Configure collision bounds, scale, and origin for the enemy sprite
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        this.setSize(8, 27);
        this.setScale(4);
        this.setOffset(12, 5);
        this.setOrigin(0.5, 1);

        /*
        // Particle emitter setup for hit effect (Phaser 3.60+)
        this.emitter = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: { min: 50, max: 150 }, // Adjust speed for a blocky effect
            scale: { start: 1, end: 1 }, // Keep the scale constant for blocky particles
            lifespan: 500, // Lifespan of the particles in milliseconds
            gravityY: 300, // Add gravity to make particles fall
            bounce: 1, // Add some bounce for a more blocky effect
            quantity: 5, // Emit fewer particles for a blocky feel
            blendMode: 'NORMAL' // Use normal blend mode for solid blocky particles
        });

        // Initially hide the emitter
        this.emitter.setVisible(false);
        */
    }

    /** Sets up event listeners for the enemy, particularly for the scene's update event. */
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
        // Only move when on the ground
        if (!this.body || !this.body.onFloor()) {
            return;
        }

        this.currentWalkDistance += Math.abs(this.body.deltaX());

        // Perform raycasting to detect edges and obstacles
        const {ray, hasHit} = this.rayCast(this.body, this.terrainColliderLayer, {
            rayLength: 90,
            precision: 1,
            steepness: 0.5
        });

        // Flip direction if edge is detected or max walk distance is reached
        if ((!hasHit || this.currentWalkDistance >= this.maxWalkDistance)
            && (time - this.timeSinceLastTurn > this.turnDelay)) {
            this.flipDirection();
            this.timeSinceLastTurn = time;
            this.currentWalkDistance = 0;
        }

        // Follow the survivor if within detection range
        if (this.survivor) {
            this.followSurvivor();
        }

        // Draw ray line for debugging if in debug mode
        if (this.config.debug && ray) {
            this.rayGraphics.clear();
            this.rayGraphics.strokeLineShape(ray);
        }
    }

    /** Flips the enemy's direction and reverses its speed. */
    flipDirection() {
        this.setFlipX(!this.flipX);
        this.speed = -this.speed;
        this.setVelocityX(this.speed);
    }

    /** Makes the enemy follow the survivor if within detection range. */
    followSurvivor() {
        // Calculate the distance between enemy and survivor
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.survivor.x,
            this.survivor.y
        );

        if (distanceToPlayer < this.detectionRange) {
            // Move towards the survivor based on their position
            if (this.survivor.x < this.x) {
                this.setVelocityX(-this.followSpeed);
                this.setFlipX(true);
            } else {
                // Return to normal patrol speed if survivor is out of range
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
     */
    setTerrainColliders(terrainColliderLayer) {
        this.terrainColliderLayer = terrainColliderLayer;
    }

    /**
     * Reduces the enemy's health when it takes damage and checks for death.
     * @param {object} source - The object that dealt the damage.
     */
    takeDamage(source) {
        source.deliverHit(this); // Notify the source that it hit this enemy
        this.health -= source.damage; // Subtract damage from health

        // If health drops to zero or below, trigger enemy death
        if (this.health <= 0) {
            this.body.setVelocity(0); // Stop any movement
            this.body.setEnable(false); // Disable physics interactions
            this.setCollideWorldBounds(false); // Ignore world bounds
            this.body.checkCollision.none = true; // Ignore all collisions
            this.rayGraphics.clear(); // Clear debugging ray graphics
            this.scene.events.removeListener(Phaser.Scenes.Events.UPDATE, this.update, this);
        }

        /*
        this.emitter.setPosition(this.x, this.y);
        this.emitter.setVisible(true);
        this.emitter.explode(10); // Emit 10 particles from the enemy's position
        */
    }
}

export default Enemy;