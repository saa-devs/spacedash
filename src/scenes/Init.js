import survivor from '../../assets/player/survivor.png';
import tilemapJSON from '../../assets/tileset/spacetileset.json';
import tilesetImage from '../../assets/tileset/spacetileset.png';

class Init extends Phaser.Scene {
    constructor() {
        super('init');
    }

    preload() {
        /* Load tileset JSON file and image */
        this.load.tilemapTiledJSON('tilemap', tilemapJSON);
        this.load.image('tileset', tilesetImage);

        /* Load player spritesheet */
        this.load.spritesheet('survivor', survivor, {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    /* Once assets are loaded, start the 'play' scene */
    create() {
        this.scene.start('play');
    }
}

export default Init;