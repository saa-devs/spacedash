/**
 * @fileoverview Defines and initialises animations for the Undead enemy character.
 * This file configures various animations for different states such as idle, hit, hurt, and death.
 */

/**
 * Creates and sets up animations for the Undead enemy character.
 *
 * @param {Phaser.Animations.AnimationManager} anims - The animation manager used to create and manage animations.
 */
export default anims => {
    // Check if the idle animation already exists to prevent duplicate creation
    if (!anims.exists('undead-idle')) {
        anims.create({
            key: 'undead-idle', // Animation key for idle state
            frames: anims.generateFrameNumbers('undead', { frames: [6, 7, 8, 9, 10, 11] }),
            frameRate: 6,
            repeat: -1 // Loop indefinitely
        });
    }

    // Check if the hit animation exists to prevent duplicate creation
    if (!anims.exists('undead-hit')) {
        anims.create({
            key: 'undead-hit', // Animation key for hit state
            frames: anims.generateFrameNumbers('undead', { frames: [12, 13, 14, 15] }),
            frameRate: 10,
            repeat: 0 // Play once
        });
    }

    // Check if the hurt animation exists to prevent duplicate creation
    if (!anims.exists('undead-hurt')) {
        anims.create({
            key: 'undead-hurt', // Animation key for hurt state
            frames: anims.generateFrameNumbers('undead', { start: 18, end: 19 }),
            frameRate: 5,
            repeat: 0 // Play once
        });
    }

    // Check if the death animation exists to prevent duplicate creation
    if (!anims.exists('undead-die')) {
        anims.create({
            key: 'undead-die', // Animation key for death state
            frames: anims.generateFrameNumbers('undead', { start: 24, end: 29 }),
            frameRate: 5,
            repeat: 0 // Play once
        });
    }
};