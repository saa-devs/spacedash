import Enemy from './Enemy';
import initAnimations from "../animations/undeadAnimations";
import Phaser from "phaser";

/* Undead is a type of enemy and extends from super class Enemy */
class Undead extends Enemy {
    constructor(scene, x, y, survivor) {
        super(scene, x, y, 'undead', survivor);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        initAnimations(this.scene.anims);

        this.isDead = false; // Track if the enemy is dead
    }

    update(time) {
        if (this.isDead) return; // Stop updating if the enemy is dead
        super.update(time);

        if (this.isPlayingAnims('undead-hurt')
            || this.isPlayingAnims('undead-hit')
            || this.isPlayingAnims('undead-die')) {
            return;
        }

        this.play('undead-idle', true);
    }

    takeDamage(source) {
        if (this.isDead) return; // Don't take damage if already dead
        super.takeDamage(source);
        this.play('undead-hurt', true);

        if (this.health <= 0) {
            this.play('undead-die', true);

            this.once('animationcomplete-undead-die', () => {
                this.setFrame(29); // Stay on the last frame of the die animation
                this.setActive(false);
                this.isDead = true; // Mark the enemy as dead
            });
        }
    }
}

export default Undead;
