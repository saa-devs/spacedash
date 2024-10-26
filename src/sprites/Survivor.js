import Phaser from 'phaser';
import initAnimations from '../animations/survivorAnimations'
import collidable from '../mixins/collidable'

class Survivor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'survivor');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        /* Defines the Survivor object's collision behaviour by adding all properties and methods from the
           collidable mixin to this instance */
        Object.assign(this, collidable);

        /* Initial setup */
        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 1300;
        this.jumpVelocity = -600;
        this.playerSpeed = 225;

        /* Input: Set up A and D keys for movement */
        this.keys = this.scene.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S
        });

        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setSize(8, 27);
        this.setOffset(13, 5);
        this.setOrigin(0.5, 1);

        /* Initialise survivor sprites animations */
        initAnimations(this.scene.anims);
    }

    initEvents() {
        /* Listen for the scene's update event */
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(args) {
        const {a, d, w, s} = this.keys;
        const onFloor = this.body.onFloor(); // Check if sprites is on the ground

        /* Move left or right based on key input */
        if (a.isDown) {
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true); // Face left
        } else if (d.isDown) {
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false); // Face right
        } else {
            this.setVelocityX(0); // Stop moving
        }

        /* Trigger the jump animation and set upward velocity */
        if (Phaser.Input.Keyboard.JustDown(w) && onFloor) {
            this.setVelocityY(this.jumpVelocity);
            this.play('jump', true); // Play jump animation
        }

        /* Ensure the jump animation plays while airborne */
        if (!onFloor && (!this.anims.currentAnim || this.anims.currentAnim.key !== 'jump')) {
            this.play('jump', true); // Keep playing jump animation while in the air
        }

        /* Play walk animation if moving and on the ground */
        if (onFloor && this.body.velocity.x !== 0) {
            if (!this.anims.currentAnim || this.anims.currentAnim.key !== 'walk') {
                this.play('walk', true);
            }
        }

        if (s.isDown && onFloor) {
            this.setVelocityX(0); // Stop horizontal movement when crouching
            if (!this.anims.currentAnim || this.anims.currentAnim.key !== 'crouch') {
                this.play('crouch', true);
            }
            return;
        }

        /* Play idle animation if stopped and on the ground */
        if (onFloor && this.body.velocity.x === 0) {
            if (!this.anims.currentAnim || this.anims.currentAnim.key !== 'idle') {
                this.play('idle-start', true);
                this.once('animationcomplete-idle-start', () => {
                    this.play('idle', true); // Play idle after idle-start animation
                });
            }
        }
    }
}

export default Survivor;