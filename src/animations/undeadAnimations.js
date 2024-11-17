/**
 * REFERENCES: All credits for the spritesheet go to the original creator; I do not claim ownership.
 * E. Svahn. “Asset Pack”. 2D Pixel Space Horror Pack by Erik Svahn.
 * Accessed: 10 October, 2024. [Online].
 * Available: https://eriksvahn.itch.io/2d-pixel-space-horror-pack
 */

/**
 * @fileoverview Defines and initialises animations for the Undead enemy character.
 * This file configures various animations for different states such as idle, hit, hurt, and death.
 */

/**
 * Creates and sets up animations for the Undead enemy character.
 * @param {Phaser.Animations.AnimationManager} anims - The animation manager used to create and manage animations.
 */
export default anims => {
    if (!anims.exists('undead-idle')) {
        anims.create({
            key: 'undead-idle', // Animation key for idle state
            frames: anims.generateFrameNumbers('undead', { frames: [6, 7, 8, 9, 10, 11] }),
            frameRate: 6,
            repeat: -1 // Loop indefinitely
        });
    }

    if (!anims.exists('undead-hit')) {
        anims.create({
            key: 'undead-hit', // Animation key for hit state
            frames: anims.generateFrameNumbers('undead', { frames: [12, 13, 14, 15] }),
            frameRate: 10,
            repeat: 0 // Play once
        });
    }

    if (!anims.exists('undead-hurt')) {
        anims.create({
            key: 'undead-hurt', // Animation key for hurt state
            frames: anims.generateFrameNumbers('undead', { start: 18, end: 19 }),
            frameRate: 5,
            repeat: 0 // Play once
        });
    }

    if (!anims.exists('undead-die')) {
        anims.create({
            key: 'undead-die', // Animation key for death state
            frames: anims.generateFrameNumbers('undead', { start: 24, end: 29 }),
            frameRate: 5,
            repeat: 0 // Play once
        });
    }
};