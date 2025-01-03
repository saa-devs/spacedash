/**
 * This function sets up an animation for a blue coin sprite, where the coin spins continuously.
 * It uses the provided animation manager to create a looping animation with frames for the coin's spin effect.
 *
 * @function
 * @param {Phaser.Animations.AnimationManager} anims - The animation manager used to create and manage animations.
 */

export default anims => {
    if (!anims.exists('spin')) {
        anims.create({
            key: 'spin',
            frames: anims.generateFrameNumbers('blue-coin', { start: 0, end: 6 }),
            frameRate: 15,
            repeat: -1
        });
    }
};