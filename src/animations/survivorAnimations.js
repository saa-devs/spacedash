/**
 * A function to create animations for the survivor character.
 *
 * @param {Phaser.Animations.AnimationManager} anims - The animation manager used to create and manage animations.
 */
export default anims => {
    anims.create({
        key: 'idle-start', // To play frame 0 before playing idle
        frames: anims.generateFrameNumbers('survivor', {frames: [0]}),
        frameRate: 7,
        repeat: 0 // Play once
    });

    anims.create({
        key: 'idle', // Idle animation
        frames: anims.generateFrameNumbers('survivor', {frames: [1, 2, 3, 2, 1]}),
        frameRate: 0.5,
        repeat: -1
    });

    anims.create({
        key: 'walk', // Walk animation
        frames: anims.generateFrameNumbers('survivor', {start: 8, end: 13}),
        frameRate: 7,
        repeat: -1
    });

    anims.create({
        key: 'jump', // Jump animation
        frames: anims.generateFrameNumbers('survivor', {start: 16, end: 19}),
        frameRate: 7,
        repeat: 0
    });

    anims.create({
        key: 'crouch',
        frames: anims.generateFrameNumbers('survivor', {frames: [24, 25]}),
        frameRate: 3,
        repeat: 0
    });

    anims.create({
        key: 'shoot',
        frames: anims.generateFrameNumbers('survivor', {start: 32, end: 34}),
        frameRate: 10,
        repeat: 0
    });

    anims.create({
        key: 'shoot-short',
        frames: anims.generateFrameNumbers('survivor', {start: 33, end: 34}), // Adjust the frame numbers as needed
        frameRate: 10,
        repeat: 0 // Play once
    });

    anims.create({
        key: 'crouch-shoot',
        frames: anims.generateFrameNumbers('survivor', {start: 40, end: 42}), // Crouch shooting frames
        frameRate: 10,
        repeat: 0 // Play once
    });

    anims.create({
        key: 'crouch-quick-shoot',
        frames: anims.generateFrameNumbers('survivor', {start: 41, end: 42}), // Crouch shooting frames
        frameRate: 10,
        repeat: 0 // Play once
    });
};