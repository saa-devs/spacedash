import Phaser from 'phaser';
import initAnimations from './survivorAnimations'

class Survivor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'survivor');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 500;
        this.playerSpeed = 200;

        /* Input: Set up A and D keys for movement */
        this.keys = this.scene.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);

        /* Initialise survivor player animations */
        initAnimations(this.scene.anims);
    }

    initEvents() {
        /* Listen for the scene's update event */
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(args) {
        const {a, d} = this.keys;

        /* Move left or right based on key input */
        if (a.isDown) {
            this.setVelocityX(-this.playerSpeed); // Flip sprite to face left
            this.setFlipX(true)
        } else if (d.isDown) {
            this.setVelocityX(this.playerSpeed); // Flip sprite to face right
            this.setFlipX(false)
        } else {
            this.setVelocityX(0); // Stop moving
        }

        /* If the player's velocity is not 0, play the walk animation */
        if (this.body.velocity.x !== 0) {
            this.play('walk', true);
        }

        /* Play idle-start if stopped, then switch to idle */
        if (this.body.velocity.x === 0 && (!this.anims.currentAnim || this.anims.currentAnim.key !== 'idle')) {
            this.play('idle-start', true);
            this.once('animationcomplete-idle-start', () => {
                this.play('idle', true); // Switch to idle after idle-start animation
            });
        }
    }
}

export default Survivor;