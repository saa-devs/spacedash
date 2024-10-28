import survivor from '../../game-assets/sprites/survivor.png';
import undead from '../../game-assets/sprites/undead.png';
import tilemapJSON from '../../game-assets/tileset/spacetileset.json';
import tilesetImage from '../../game-assets/tileset/spacetileset.png';

class Init extends Phaser.Scene {
    constructor() {
        super('init');
    }

    preload() {
        /* Load tileset JSON file and image */
        this.load.tilemapTiledJSON('tilemap', tilemapJSON);
        this.load.image('tileset', tilesetImage);

        /* Load spritesheets */
        this.load.spritesheet('survivor', survivor, {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('undead', undead, {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    /* Once game-assets are loaded, start the 'play' scene */
    create() {
        this.scene.start('play');
    }
}

export default Init;