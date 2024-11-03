import Enemy from './Enemy'
import initAnimations from "../animations/undeadAnimations";
import Phaser from "phaser";

/* Undead is a type of enemy and extends from super class Enemy */
class Undead extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'undead');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        initAnimations(this.scene.anims);
    }

    update(time, delta) {
        super.update(time, delta);
        this.play('undead-idle', true);
    }
}

export default Undead;