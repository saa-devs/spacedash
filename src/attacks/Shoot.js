import Phaser from 'phaser';

class Shoot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 1000;
        this.setScale(4);
        this.maxDistance = 300;
        this.travelDistance = 0;

        this.damage = 1;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.travelDistance += this.body.deltaAbsX();

        if (this.travelDistance >= this.maxDistance) {
            this.activeShoot(false);

        }
    }

    fire(player, isCrouching) {
        this.travelDistance = 0; // Reset travel distance when firing
        const offsetX = 30;
        let offsetY = -85;

        if (isCrouching) {
            offsetY = -55;
        }

        if (player.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
            this.setPosition(player.x + offsetX, player.y + offsetY);
            this.setVelocityX(this.speed);
            this.setFlipX(false); // Ensure the beam is NOT flipped when facing right
        } else {
            this.setPosition(player.x - offsetX, player.y + offsetY);
            this.setVelocityX(-this.speed);
            this.setFlipX(true); // Flip the beam when facing left
        }
        this.activeShoot(true);

    }

    deliverHit(enemy) {
        this.activeShoot(false);
        this.body.reset(0, 0);
    }

    activeShoot(isActive) {
        this.setActive(isActive);
        this.setVisible(isActive);
    }
}

export default Shoot;
