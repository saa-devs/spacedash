import Phaser from "phaser";
import Shoot from './Shoot';

class Projectiles extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            active: false,
            visible: false,
            key: 'beam',
            classType: Shoot
        });
    }

    fireProjectile(player, isCrouching) {
        const projectile = this.getFirstDead(false);
        if (!projectile) return;
        projectile.fire(player, isCrouching);
    }
}

export default Projectiles;
