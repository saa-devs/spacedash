/**
 * @fileoverview The main player character. Inherits physics, animations, and collision behavior from Phaser.
 */

import Phaser from 'phaser';
import initAnimations from '../animations/survivorAnimations';
import collidable from '../mixins/collidable';
import animations from '../mixins/animations';
import HealthBar from '../gamebar/HealthBar';
import Projectiles from '../attacks/Projectiles';
import EventEmitter from '../events/Emitter';

/**
 * @class Survivor
 * @extends {Phaser.Physics.Arcade.Sprite}
 * @classdesc Represents the player character with properties for movement, shooting, health, and interactions.
 */
class Survivor extends Phaser.Physics.Arcade.Sprite {
    /**
     * Creates an instance of Survivor.
     * @param {Phaser.Scene} scene - The scene to which this player character belongs.
     * @param {number} x - The x-coordinate to position the player.
     * @param {number} y - The y-coordinate to position the player.
     */
    constructor(scene, x, y) {
        super(scene, x, y, 'survivor');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        Object.assign(this, collidable);
        Object.assign(this, animations);

        this.init();
        this.initEvents();
    }

    /**
     * Initialises survivor's physics, movement properties, input keys, animations, and health bar.
     */
    init() {
        this.gravity = 1300;
        this.jumpVelocity = -600;
        this.playerSpeed = 225;
        this.body.setGravityY(this.gravity);
        this.setImmovable(true);

        this.projectiles = new Projectiles(this.scene); // Projectiles for shooting

        this.currentHealth = 6;
        this.healthBar = new HealthBar(this.scene, 70, 121);

        this.hasBeenHit = null;
        this.isShooting = false;
        this.hasShotOnce = false;
        this.isCrouching = false;
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        this.isDead = false;

        this.keys = this.scene.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S
        });

        this.light = this.scene.lights.addLight(this.x, this.y, 350)
            .setColor(0xd9fffb)
            .setIntensity(1);
        this.scene.lights.enable().setAmbientColor(0x504978);

        // Set up shooting with Enter key
        this.scene.input.keyboard.on('keydown-ENTER', () => {
            if (!this.body.onFloor() || this.body.velocity.x !== 0) return;

            this.isShooting = true;

            if (this.isCrouching) {
                if (this.hasShotOnce) {
                    this.play('crouch-quick-shoot', true).once('animationcomplete-shoot', () => this.setFrame(42));
                    this.projectiles.fireProjectile(this, this.isCrouching);
                    return;
                }
                this.play('crouch-shoot', true).once('animationcomplete-shoot', () => this.setFrame(42));
                this.projectiles.fireProjectile(this, this.isCrouching);
                this.hasShotOnce = true;
            } else {
                if (this.hasShotOnce) {
                    this.play('shoot-short', true).once('animationcomplete-shoot', () => this.setFrame(34));
                    this.projectiles.fireProjectile(this, this.isCrouching);
                    return;
                }
                this.play('shoot', true).once('animationcomplete-shoot', () => this.setFrame(34));
                this.projectiles.fireProjectile(this, this.isCrouching);
                this.hasShotOnce = true;
            }
        });

        this.body.setSize(8, 26);
        this.body.setOffset(12, 6);
        this.setOrigin(0.5, 1);
        this.setScale(4);

        initAnimations(this.scene.anims);
    }

    /** Sets up event listeners for the scene's update event. */
    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    /**
     * Updates the character's movement, animations, and state based on user input and physics.
     * @param {number} time - The current time.
     */
    update(time) {
        if (this.isDead) return;

        const { a, d, w, s } = this.keys;
        const onFloor = this.body.onFloor();

        this.x > 675 ? this.setPipeline('Light2D') : this.resetPipeline();
        const lightOffset = this.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT ? 60 : -60;
        this.light.setPosition(this.x + lightOffset, this.y - 80);

        if (a.isDown) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
            this.isCrouching = false;
            this.isShooting = false;
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true);
            this.play('walk', true);
        } else if (d.isDown) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
            this.isCrouching = false;
            this.isShooting = false;
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false);
            this.play('walk', true);
        } else {
            this.setVelocityX(0);
        }

        if ((Phaser.Input.Keyboard.JustDown(w)) && onFloor) {
            if (this.isCrouching) {
                this.isCrouching = false;
                if (!this.anims.currentAnim || this.anims.currentAnim.key !== 'idle') {
                    this.play('idle-start', true);
                    this.once('animationcomplete-idle-start', () => this.play('idle', true));
                }
            } else {
                this.setVelocityY(this.jumpVelocity);
                this.play('jump', true).once('animationcomplete', () => {});
            }
            return;
        }

        if (!onFloor && (!this.anims.currentAnim || this.anims.currentAnim.key !== 'jump')) {
            this.play('jump', true);
        }

        if (Phaser.Input.Keyboard.JustDown(s) && onFloor) {
            this.isCrouching = true;
            this.setVelocityX(0);
            this.play('crouch', true).once('animationcomplete', () => {});
            return;
        }

        if (s.isDown && onFloor) {
            if (!this.isCrouching) {
                this.isCrouching = true;
                this.setVelocityX(0);
                this.setFrame(25);
            }
            this.isCrouching = true;
            return;
        }

        if (onFloor && this.body.velocity.x === 0 && !this.isShooting && !this.isCrouching && !s.isDown) {
            if (!this.anims.currentAnim || this.anims.currentAnim.key !== 'idle') {
                this.play('idle-start', true);
                this.once('animationcomplete-idle-start', () => this.play('idle', true));
            }
        }
    }

    /**
     * Handles being hit by an enemy, reducing health and playing damage animations.
     * @param {Phaser.GameObjects.Sprite} initiatorEnemy - The enemy that caused the hit.
     */
    handleHit(initiatorEnemy) {
        if (this.hasBeenHit) return;

        this.currentHealth -= initiatorEnemy.damage;
        this.healthBar.takeDamage(this.currentHealth);

        if (this.currentHealth <= 0) {
            this.hasBeenHit = true;
            this.isDead = true;

            this.play('die', true).once('animationcomplete', () => {
                EventEmitter.emit('PLAYER_LOOSE');
            });
            return;
        }

        this.hasBeenHit = true;
        this.playDamageAnimation();
        initiatorEnemy.play('undead-hit', true);

        this.scene.time.delayedCall(500, () => {
            this.hasBeenHit = false;
        });
    }

    /**
     * Plays a damage animation by flashing the character to indicate being hit.
     */
    playDamageAnimation() {
        this.scene.tweens.add({
            targets: this,
            duration: 50,
            repeat: 4,
            yoyo: true,
            alpha: 0,
            onComplete: () => this.setAlpha(1)
        });
    }
}

export default Survivor;