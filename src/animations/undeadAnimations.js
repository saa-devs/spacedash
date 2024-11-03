export default anims => {
    if (!anims.exists('undead-idle')) {
        anims.create({
            key: 'undead-idle',
            frames: anims.generateFrameNumbers('undead', {frames: [6, 7, 8, 9, 10, 11]}),
            frameRate: 6,
            repeat: -1
        });
    }
};