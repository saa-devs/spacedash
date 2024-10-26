import Phaser from 'phaser';
import collidable from '../mixins/collidable'

class Undead extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'undead');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        /* Defines the Survivor object's collision behaviour by adding all properties and methods from the
           collidable mixin to this instance */
        Object.assign(this, collidable);

        /* Initial setup */
        this.init();
    }

    init() {
        this.gravity = 450;
        this.playerSpeed = 300;

        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        this.setSize(8, 27);
        this.setOffset(12, 5);
        this.setOrigin(0.5, 1);

        /* Initialise survivor sprites animations */
    }
}

export default Undead;