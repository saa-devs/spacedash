/**
 * @fileoverview The main player character. Inherits physics, animations, and collision behavior from Phaser.
 * Note: This class uses Phaser's built-in components and does not manually implement interface methods.
 */

import Phaser from 'phaser';
import initAnimations from '../animations/survivorAnimations';
import collidable from '../mixins/collidable';
import animations from '../mixins/animations';
import HealthBar from '../gamebar/HealthBar';
import Projectiles from '../attacks/Projectiles'

class Survivor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        /**
         * Creates an instance of Survivor.
         * @param {Phaser.Scene} scene - The scene to which this player character belongs.
         * @param {number} x - The x-coordinate to position the player.
         * @param {number} y - The y-coordinate to position the player.
         */
        super(scene, x, y, 'survivor');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Mix in collision behavior from the collidable mixin
        Object.assign(this, collidable);
        Object.assign(this, animations);

        // Initial setup
        this.init();
        this.initEvents();
    }

    /**
     * Initialises the player character's properties, input controls, and animations.
     */
    init() {
        // Physics
        this.gravity = 1300;
        this.jumpVelocity = -600;
        this.playerSpeed = 225;
        this.body.setGravityY(this.gravity);

        // Survivor behaviour
        this.hasBeenHit = null;
        this.isShooting = false;
        this.hasShotOnce = false;
        this.isCrouching = false;
        this.isJumping = false;
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;

        this.currentHealth = 6;

        this.projectiles = new Projectiles(this.scene);

        // Setup wasd keys for movement
        this.keys = this.scene.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S
        });

        this.scene.input.keyboard.on('keydown-ENTER', () => {

            if (this.body.velocity.x !== 0 || this.isJumping) {
                return;
            }

            this.isShooting = true; // Set the shooting flag

            if (this.isCrouching) {
                if (this.hasShotOnce) {
                    this.play('crouch-quick-shoot', true).once('animationcomplete-shoot', () => {
                        this.setFrame(42); // Set to the last frame of the shoot animation
                    });
                    this.projectiles.fireProjectile(this, this.isCrouching);
                    return;
                }

                this.play('crouch-shoot', true).once('animationcomplete-shoot', () => {
                    this.setFrame(42); // Set to the last frame of the shoot animation
                });
                this.projectiles.fireProjectile(this, this.isCrouching);
                this.hasShotOnce = true;

            } else {
                if (this.hasShotOnce) {
                    this.play('shoot-short', true).once('animationcomplete-shoot', () => {
                        this.setFrame(34); // Set to the last frame of the shoot animation
                    });
                    this.projectiles.fireProjectile(this, this.isCrouching);
                    return;
                }
                // Play the shooting animation
                this.play('shoot', true).once('animationcomplete-shoot', () => {
                    this.setFrame(34); // Set to the last frame of the shoot animation
                });
                this.projectiles.fireProjectile(this, this.isCrouching);
                this.hasShotOnce = true;
            }
        });

        // Colliders, size and position
        this.setCollideWorldBounds(true);
        this.setScale(4);
        this.setSize(8, 27);
        this.setOffset(13, 5);
        this.setOrigin(0.5, 1);

        // Initialise survivor sprite animations
        initAnimations(this.scene.anims);
        this.healthBar = new HealthBar(this.scene, 60, 100);
    }

    /**
     * Sets up event listeners for the scene's update event.
     */
    initEvents() {
        // Listen for the scene's update event
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time) {
        const {a, d, w, s} = this.keys;
        const onFloor = this.body.onFloor();

        // Move left or right based on key input
        if (a.isDown) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
            this.isCrouching = false;
            this.isShooting = false; // Reset shooting state when moving
            this.isJumping = false;
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true); // Face left
            this.play('walk', true); // Play walk animation
        } else if (d.isDown) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
            this.isCrouching = false;
            this.isShooting = false; // Reset shooting state when moving
            this.isJumping = false;
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false); // Face right
            this.play('walk', true); // Play walk animation
        } else {
            this.setVelocityX(0); // Stop moving
        }

        if (Phaser.Input.Keyboard.JustDown(w) && onFloor) {
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
                this.isJumping = true;
                // If not crouching, perform the jump
                this.setVelocityY(this.jumpVelocity);
                this.play('jump', true).once('animationcomplete', () => {
                    this.isJumping = false; // Reset isJumping when the animation is complete
                });
            }
            return;
        }

        // Ensure the jump animation plays while airborne
        if (!onFloor && (!this.anims.currentAnim || this.anims.currentAnim.key !== 'jump')) {
            this.play('jump', true); // Keep playing jump animation while in the air
        }

        if (Phaser.Input.Keyboard.JustDown(s) && onFloor) {
            this.isCrouching = true;
            this.setVelocityX(0); // Stop moving
            this.play('crouch', true).once('animationcomplete', () => {
            });
            return;
        }

        if (s.isDown && onFloor) {
            if (!this.isCrouching) {
                this.isCrouching = true; // Set crouching state
                this.setVelocityX(0); // Stop moving
                // Play the crouch animation once: frames 24 and 25
                this.setFrame(25); // Stay on frame 25 after the animation completes
            }
            this.isCrouching = true;
            return; // Exit the update loop to keep crouching
        }

        // Play idle animation if stopped and on the ground
        if (onFloor && this.body.velocity.x === 0 && !this.isShooting && !this.isCrouching && !s.isDown) {
            if (!this.anims.currentAnim || this.anims.currentAnim.key !== 'idle') {
                this.play('idle-start', true);
                this.once('animationcomplete-idle-start', () => {
                    this.play('idle', true); // Play idle after idle-start animation
                });
            }
        }
    }

    handleHit(initiatorEnemy) {
        if (this.hasBeenHit) return; // Prevent multiple hits at the same time

        this.hasBeenHit = true;
        this.playDamageAnimation();
        initiatorEnemy.play('undead-hit', true);

        this.currentHealth -= initiatorEnemy.damage;
        this.healthBar.takeDamage(this.currentHealth);

        // Reset the `hasBeenHit` flag after a delay to allow subsequent hits
        this.scene.time.delayedCall(1000, () => {
            this.hasBeenHit = false; // Reset after 1 second
        });
    }

    playDamageAnimation() {
        this.scene.tweens.add({
            targets: this, duration: 100, repeat: 4, yoyo: true, alpha: 0, onComplete: () => {
                this.setAlpha(1);
            }
        });
    }
}

export default Survivor;