/**
 * REFERENCES: All credits for the spritesheet go to the original creator; I do not claim ownership.
 * E. Svahn. “Asset Pack”. 2D Pixel Space Horror Pack by Erik Svahn.
 * Accessed: 10 October, 2024. [Online].
 * Available: https://eriksvahn.itch.io/2d-pixel-space-horror-pack
 */

/**
 * @fileoverview Defines and initialises animations for the Survivor character.
 * This file configures various animations for different states such as idle, walk, jump, and attack.
 */

/**
 * Creates and sets up animations for the Survivor character.
 * @param {Phaser.Animations.AnimationManager} anims - The animation manager used to create and manage animations.
 */
export default anims => {
    // Initial idle frame to be played once before the main idle loop
    anims.create({
        key: 'idle-start', // Animation key for starting idle state
        frames: anims.generateFrameNumbers('survivor', { frames: [0] }),
        frameRate: 7,
        repeat: 0 // Play once
    });

    // Idle animation loop
    anims.create({
        key: 'idle', // Animation key for idle state
        frames: anims.generateFrameNumbers('survivor', { frames: [1, 2, 3, 2, 1] }),
        frameRate: 0.5,
        repeat: -1 // Loop indefinitely
    });

    // Walking animation for movement
    anims.create({
        key: 'walk', // Animation key for walk state
        frames: anims.generateFrameNumbers('survivor', { start: 8, end: 13 }),
        frameRate: 7,
        repeat: -1 // Loop indefinitely
    });

    // Jump animation for ascending and descending
    anims.create({
        key: 'jump', // Animation key for jump state
        frames: anims.generateFrameNumbers('survivor', { start: 16, end: 19 }),
        frameRate: 7,
        repeat: 0 // Play once
    });

    // Crouch animation for when the character crouches
    anims.create({
        key: 'crouch', // Animation key for crouch state
        frames: anims.generateFrameNumbers('survivor', { frames: [24, 25] }),
        frameRate: 3,
        repeat: 0 // Play once
    });

    // Shooting animation while standing
    anims.create({
        key: 'shoot', // Animation key for shoot action
        frames: anims.generateFrameNumbers('survivor', { start: 32, end: 34 }),
        frameRate: 10,
        repeat: 0 // Play once
    });

    // Shorter shooting animation while standing
    anims.create({
        key: 'shoot-short', // Animation key for quick shoot action
        frames: anims.generateFrameNumbers('survivor', { start: 33, end: 34 }),
        frameRate: 10,
        repeat: 0 // Play once
    });

    // Crouch shooting animation
    anims.create({
        key: 'crouch-shoot', // Animation key for crouch shoot action
        frames: anims.generateFrameNumbers('survivor', { start: 40, end: 42 }),
        frameRate: 10,
        repeat: 0 // Play once
    });

    // Quicker crouch shooting animation
    anims.create({
        key: 'crouch-quick-shoot', // Animation key for quick crouch shoot action
        frames: anims.generateFrameNumbers('survivor', { start: 41, end: 42 }),
        frameRate: 10,
        repeat: 0 // Play once
    });

    anims.create({
        key: 'die', // Animation key for quick crouch shoot action
        frames: anims.generateFrameNumbers('survivor', { start: 48, end: 55 }),
        frameRate: 3,
        repeat: 0 // Play once
    });
};