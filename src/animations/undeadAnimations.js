/**
 * A function to create animations for the undead enemy.
 *
 * @param {Phaser.Animations.AnimationManager} anims - The animation manager used to create and manage animations.
 */
export default anims => {
    if (!anims.exists('undead-idle')) {
        anims.create({
            key: 'undead-idle',
            frames: anims.generateFrameNumbers('undead', {frames: [6, 7, 8, 9, 10, 11]}),
            frameRate: 6,
            repeat: -1
        });
    }

    if (!anims.exists('undead-hit')) {
        anims.create({
            key: 'undead-hit',
            frames: anims.generateFrameNumbers('undead', {frames: [12, 13, 14, 15]}),
            frameRate: 10,
            repeat: 0
        });
    }
};