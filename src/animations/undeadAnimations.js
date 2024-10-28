export default anims => {
    if (!anims.exists('undead-idle')) {
        anims.create({
            key: 'undead-idle',
            frames: anims.generateFrameNumbers('undead', {frames: [0, 1, 2, 3, 2, 1, 0]}),
            frameRate: 0.5,
            repeat: -1
        });
    }
};