/**
 * @fileoverview The main player character. Inherits physics, animations, and collision behavior from Phaser.
 */

import Phaser from 'phaser';
import initAnimations from '../animations/survivorAnimations';
import collidable from '../mixins/collidable';
import animations from '../mixins/animations';
import HealthBar from '../gamebar/HealthBar';
import Projectiles from '../attacks/Projectiles'

/**
 * @class Survivor
 * @extends {Phaser.Physics.Arcade.Sprite}
 * @classdesc Represents the player character with properties for movement, shooting, health, and interactions.
 */
class Survivor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        /**
         * Creates an instance of Survivor.
         * @param {Phaser.Scene} scene - The scene to which this player character belongs.
         * @param {number} x - The x-coordinate to position the player.
         * @param {number} y - The y-coordinate to position the player.
         */
        super(scene, x, y, 'survivor');
        scene.add.existing(this); // Add the survivor character to the current scene
        scene.physics.add.existing(this); // Enable physics for the survivor character

        // Add collision and animation behaviors from mixins
        Object.assign(this, collidable);
        Object.assign(this, animations);

        // Initialise character settings and input events
        this.init();
        this.initEvents();
    }

    /**
     * Initialises survivor's physics, movement properties, input keys, animations, and health bar.
     */
    init() {
        // Physics properties
        this.gravity = 1300;
        this.jumpVelocity = -600;
        this.playerSpeed = 225;
        this.body.setGravityY(this.gravity);

        this.projectiles = new Projectiles(this.scene); // Set up projectiles for shooting from survivor

        this.currentHealth = 6; // Character's health
        this.healthBar = new HealthBar(this.scene, 70, 121); // Initialise health bar

        // Character behavior flags
        this.hasBeenHit = null;
        this.isShooting = false;
        this.hasShotOnce = false;
        this.isCrouching = false;
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;

        // Define WASD keys for character control
        this.keys = this.scene.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S
        });

        // Add lighting to survivor
        this.light = this.scene.lights.addLight(this.x, this.y, 300)
            .setColor(0xd9fffb)
            .setIntensity(0.7);

        // Set up shooting with the Enter key
        this.scene.input.keyboard.on('keydown-ENTER', () => {
            // Only shoot if survivor is not moving or jumping
            if (!this.body.onFloor() || this.body.velocity.x !== 0) {
                return;
            }

            this.isShooting = true; // Set the shooting flag

            // Play different shooting animations if survivor is crouching
            if (this.isCrouching) {
                if (this.hasShotOnce) { // Play different animation if survivor has already shot once
                    this.play('crouch-quick-shoot', true).once('animationcomplete-shoot', () => {
                        this.setFrame(42); // Set to the last frame of the shoot animation
                    });
                    this.projectiles.fireProjectile(this, this.isCrouching);
                    return;
                }

                this.play('crouch-shoot', true).once('animationcomplete-shoot', () => {
                    this.setFrame(42);
                });
                this.projectiles.fireProjectile(this, this.isCrouching);
                this.hasShotOnce = true;

            } else {
                if (this.hasShotOnce) {
                    this.play('shoot-short', true).once('animationcomplete-shoot', () => {
                        this.setFrame(34);
                    });
                    this.projectiles.fireProjectile(this, this.isCrouching);
                    return;
                }
                this.play('shoot', true).once('animationcomplete-shoot', () => {
                    this.setFrame(34);
                });
                this.projectiles.fireProjectile(this, this.isCrouching);
                this.hasShotOnce = true;
            }
        });

        this.body.setSize(8, 26);      // Set size to match character's collision needs
        this.body.setOffset(12, 6);   // Adjust this offset as needed, especially after re-adding scale
        this.setOrigin(0.5, 1);        // Align sprite’s bottom to the ground level
        this.setScale(4)

        initAnimations(this.scene.anims); // Initialise survivor sprite animations
    }

    /** Sets up event listeners for the scene's update event. */
    initEvents() {
        // Listen for the scene's update event
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    /**
     * Updates the character's movement, animations, and state based on user input and physics.
     * @param {number} time - The current time.
     */
    update(time) {
        const {a, d, w, s} = this.keys;
        const onFloor = this.body.onFloor();

        const lightOffset = this.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT ? 100 : -100;
        this.light.setPosition(this.x + lightOffset, this.y - 80);

        // Move left or right with A and D keys
        if (a.isDown) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
            this.isCrouching = false;
            this.isShooting = false;
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true); // Move left
            this.play('walk', true);
        } else if (d.isDown) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
            this.isCrouching = false;
            this.isShooting = false;
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false); // Moe right
            this.play('walk', true);
        } else {
            this.setVelocityX(0); // Stop moving if no keys are pressed
        }

        // Jump with W key if on the ground
        if ((Phaser.Input.Keyboard.JustDown(w)) && onFloor) {
            if (this.isCrouching) {
                // If the player is crouching, go to idle instead of jumping
                this.isCrouching = false; // Reset crouching state
                if (!this.anims.currentAnim || this.anims.currentAnim.key !== 'idle') {
                    this.play('idle-start', true);
                    this.once('animationcomplete-idle-start', () => {
                        this.play('idle', true); // Play idle after idle-start animation
                    });
                }
            } else {
                // If not crouching, perform the jump
                this.setVelocityY(this.jumpVelocity); // Set vertical velocity for jump
                this.play('jump', true).once('animationcomplete', () => {
                });
            }
            return;
        }

        // Keep playing jump animation if airborne
        if (!onFloor && (!this.anims.currentAnim || this.anims.currentAnim.key !== 'jump')) {
            this.play('jump', true);
        }

        // Enter crouch mode if S key is pressed while on the ground
        if (Phaser.Input.Keyboard.JustDown(s) && onFloor) {
            this.isCrouching = true;
            this.setVelocityX(0); // Stop moving
            this.play('crouch', true).once('animationcomplete', () => {
            });
            return;
        }

        // Stay in crouching position while S key is held
        if (s.isDown && onFloor) {
            if (!this.isCrouching) {
                this.isCrouching = true;
                this.setVelocityX(0);
                this.setFrame(25);
            }
            this.isCrouching = true;
            return; // Exit the update loop to keep crouching
        }

        // Play idle animation when stationary, on the ground, and not shooting or crouching
        if (onFloor && this.body.velocity.x === 0 && !this.isShooting && !this.isCrouching && !s.isDown) {
            if (!this.anims.currentAnim || this.anims.currentAnim.key !== 'idle') {
                this.play('idle-start', true);
                this.once('animationcomplete-idle-start', () => {
                    this.play('idle', true); // Play idle after idle-start animation
                });
            }
        }
    }

    /**
     * Handles being hit by an enemy, reducing health and playing damage animations.
     * @param {Phaser.GameObjects.Sprite} initiatorEnemy - The enemy that caused the hit.
     */
    handleHit(initiatorEnemy) {
        if (this.hasBeenHit) return; // Prevent multiple hits in quick succession

        this.hasBeenHit = true;
        this.playDamageAnimation(); // Visual feedback for taking damage
        initiatorEnemy.play('undead-hit', true);

        // Decrease health and update the health bar
        this.currentHealth -= initiatorEnemy.damage;
        this.healthBar.takeDamage(this.currentHealth);

        // Reset hit status after a delay to allow another hit
        this.scene.time.delayedCall(1000, () => {
            this.hasBeenHit = false; // Reset after 1 second
        });
    }

    /**
     * Plays a damage animation by flashing the character to indicate being hit.
     */
    playDamageAnimation() {
        this.scene.tweens.add({
            targets: this, duration: 100, repeat: 4, yoyo: true, alpha: 0, onComplete: () => {
                this.setAlpha(1);
            }
        });
    }
}

export default Survivor;