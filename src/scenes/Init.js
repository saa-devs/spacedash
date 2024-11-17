/**
 * REFERENCES: All credits for the spritesheet go to the original creator; I do not claim ownership.
 * E. Svahn. “Asset Pack”. 2D Pixel Space Horror Pack by Erik Svahn.
 * Accessed: 10 October, 2024. [Online].
 * Available: https://eriksvahn.itch.io/2d-pixel-space-horror-pack
 */

/**
 * @fileoverview This file defines the Init scene for the Phaser game.
 * The Init scene is responsible for loading game assets such as images, spritesheets,
 * and tilemap data, and transitioning to the 'play' scene once loading is complete.
 */

import undead from '../../game-assets/sprites/undead.png';
import hp from '../../game-assets/ui/hp.png';
import beam from '../../game-assets/effects/beam.png';
import beamHit from '../../game-assets/effects/beamhit.png';
import particle from '../../game-assets/effects/particle.png';
import bluecoin from '../../game-assets/collectables/blue-coin.png';
import levelOne from '../../game-assets/tileset/spacetileset-levelone.json';
import levelTwo from '../../game-assets/tileset/spacetileset-leveltwo.json';
import tilesetImage from '../../game-assets/tileset/spacetileset.png';

import {player} from '../../scripts/controller/profileController';

/**
 * The Init scene is responsible for preloading game assets and transitioning
 * to the main game scene ('play') once the assets are ready.
 *
 * @class Init
 * @extends {Phaser.Scene}
 */
class Init extends Phaser.Scene {
    /**
     * Initialises the Init scene with the unique key 'init'.
     * This key is used to reference the scene throughout the game.
     * @constructor
     */
    constructor() {
        super('init');
    }

    /**
     * Preloads all necessary assets for the game.
     * Assets include tilemaps, spritesheets, and images for the game.
     *
     * @method preload
     * @returns {void}
     */
    preload() {
        // Load tilemap JSON files and the corresponding tileset image
        this.load.tilemapTiledJSON('level-one', levelOne);
        this.load.tilemapTiledJSON('level-two', levelTwo);

        this.load.image('tileset', tilesetImage);
        this.load.image('particle', particle);
        this.load.image('beam-hit', beamHit);
        this.load.image('beam', beam);

        // Load the survivor character spritesheet
        this.load.spritesheet('survivor', player.getSpritesheet(), {
            frameWidth: 32, frameHeight: 32
        });

        // Load the undead enemy spritesheet
        this.load.spritesheet('undead', undead, {
            frameWidth: 32, frameHeight: 32
        });

        // Load the health bar spritesheet
        this.load.spritesheet('hp', hp, {
            frameWidth: 8, frameHeight: 8
        });

        // Load the blue coin collectible spritesheet
        this.load.spritesheet('blue-coin', bluecoin, {
            frameWidth: 16, frameHeight: 10
        });
    }

    /**
     * Starts the 'play' scene after all assets have been successfully preloaded.
     * This method ensures that the game transitions seamlessly from the Init scene to gameplay.
     *
     * @method create
     * @returns {void}
     */
    create() {
        this.scene.start('play');
    }
}

export default Init;