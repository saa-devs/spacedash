export default anims => {
    anims.create({
        key: 'idle-start', // Quick frame 0 quickly before switching to idle
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
        frames: anims.generateFrameNumbers('survivor', {
            start: 8, end: 13
        }),
        frameRate: 7,
        repeat: -1
    });

    anims.create({
        key: 'jump', // Jump animation
        frames: anims.generateFrameNumbers('survivor', {
            start: 16, end: 19
        }),
        frameRate: 7,
        repeat: 0
    });

    anims.create({
        key: 'crouch', // Crouch animation
        frames: anims.generateFrameNumbers('survivor', {frames: [24, 25]}),
        frameRate: 7,
        repeat: 0
    });
};