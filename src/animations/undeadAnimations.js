export default anims => {
    anims.create({
        key: 'undead-idle', // Quick frame 0 quickly before switching to idle
        frames: anims.generateFrameNumbers('undead', {frames: [0, 1, 2, 3, 2, 1, 0]}),
        frameRate: 0.5,
        repeat: -1
    });
};