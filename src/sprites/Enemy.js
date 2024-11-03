import Phaser from 'phaser';
import collidable from '../mixins/collidable'

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
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
        this.gravity = 450;
        this.speed = 20;
        this.timeSinceLastTurn = 0;
        this.maxWalkDistance = 200;
        this.currentWalkDistance = 0;
        this.terrainColliderLayer = null;
        this.rayGraphics = this.scene.add.graphics({
            lineStyle: {
                width: 2, color: 0xaa00aa
            }
        });
        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        this.setSize(8, 27);
        this.setScale(4);
        this.setOffset(12, 5);
        this.setOrigin(0.5, 1);
        this.setVelocityX(this.speed);
    }

    initEvents() {
        /* Listen for the scene's update event */
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time) {
        this.enemyWalk(time);
    }

    enemyWalk(time) {
        if (!this.body || !this.body.onFloor()) {
            return;
        }
        this.currentWatchDistance += Math.abs(this.body.deltaX());
        const {ray, hasHit} = this.rayCast(this.body, this.terrainColliderLayer, {
            rayLength: 90,
            precision: 1,
            steepness: 0.5
        });
        if ((!hasHit || this.currentWalkDistance >= this.maxWalkDistance)
            && this.timeSinceLastTurn + 100 < time) {
            this.setFlipX(!this.flipX);
            this.setVelocityX(this.speed = -this.speed);
            this.timeSinceLastTurn = time;
            this.currentWatchDistance = 0;
        }

        this.rayGraphics.clear();
        this.rayGraphics.strokeLineShape(ray);
    }

    setTerrainColliders(terrainColliderLayer) {
        this.terrainColliderLayer = terrainColliderLayer;
    }
}

export default Enemy;