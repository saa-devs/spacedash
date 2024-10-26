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

    initEvents() {
        /* Listen for the scene's update event */
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(args) {
        this.play('undead-idle', true);
    }
}

export default Undead;