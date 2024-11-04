/**
 * @fileoverview This file defines the Init scene for the Phaser game.
 * The Init scene loads game assets such as images, spritesheets, and tilemap data,
 * and then starts the 'play' scene.
 */

import survivor from '../../game-assets/sprites/survivor.png';
import undead from '../../game-assets/sprites/undead.png';
import particles from '../../game-assets/effects/particle.png';
import hp from '../../game-assets/ui/hp.png';
import beam from '../../game-assets/effects/beam.png';
import tilemapJSON from '../../game-assets/tileset/spacetileset.json';
import tilesetImage from '../../game-assets/tileset/spacetileset.png';

/**
 * @class Init
 * @extends {Phaser.Scene}
 * @classdesc The Init scene is used to preload game assets and then start the main game scene.
 */
class Init extends Phaser.Scene {
    /**
     * Initialises the Init scene with the key 'init'.
     * @constructor
     */
    constructor() {
        super('init');
    }

    /**
     * Preloads all the necessary assets for the game, including images, spritesheets, and tilemap data.
     * @method
     */
    preload() {
        // Load the tilemap JSON file and the corresponding tileset image
        this.load.tilemapTiledJSON('tilemap', tilemapJSON);
        this.load.image('tileset', tilesetImage);
        this.load.image('particle', particles);
        this.load.image('beam', beam);

        // Load the survivor spritesheet
        this.load.spritesheet('survivor', survivor, {
            frameWidth: 32, frameHeight: 32
        });

        // Load the undead spritesheet
        this.load.spritesheet('undead', undead, {
            frameWidth: 32, frameHeight: 32
        });

        // In your scene's preload method
        this.load.spritesheet('hp', hp, {
            frameWidth: 8, frameHeight: 8
        });
    }

    /**
     * Called after the assets have been loaded. This method starts the 'play' scene.
     * @method
     */
    create() {
        this.scene.start('play');
    }
}

export default Init;