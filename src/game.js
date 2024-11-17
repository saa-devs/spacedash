/**
 * @fileoverview This file sets up the main configuration for the Phaser game and initialises scenes.
 */

import Phaser from 'phaser';
import Play from './scenes/Play';
import Init from './scenes/Init';

let gameInstance = null;

/**
 * @constant {number} WIDTH - The width of the game screen in pixels.
 */
const WIDTH = 1000;

/**
 * @constant {number} HEIGHT - The height of the game screen in pixels.
 */
const HEIGHT = 700;

/**
 * @typedef {Object} SharedConfig
 * @property {number} width - The width of the game screen in pixels.
 * @property {number} height - The height of the game screen in pixels.
 * @property {number} scaleFactor - The scale factor for the game.
 * @property {boolean} debug - Whether to enable debugging.
 * @property {number|null} level - The currently loaded level (null if no level is loaded).
 * @property {Object|null} player - The player object shared across scenes.
 */

/**
 * @type {SharedConfig}
 * @description Shared configurations used across different game scenes.
 */
const sharedConfig = {
    width: WIDTH,
    height: HEIGHT,
    scaleFactor: 3.5,
    debug: false,
    level: null,
    player: null,
};

/**
 * @constant {Array<Phaser.Scene>} Scenes - An array of scene classes used in the game.
 */
const Scenes = [Init, Play];

/**
 * Creates a new instance of a scene and passes shared configurations to it.
 *
 * @function createScene
 * @param {Function} Scene - The scene class to initialise.
 * @returns {Phaser.Scene} An instance of the scene.
 */
const createScene = Scene => new Scene(sharedConfig);

/**
 * Iterates over every scene from the array of scenes and initialises them.
 *
 * @function initScenes
 * @returns {Array<Phaser.Scene>} An array of initialised scene instances.
 */
const initScenes = () => Scenes.map(createScene);

/**
 * @typedef {Object} GameConfig
 * @property {number} type - The rendering type for the game (e.g., Phaser.WEBGL).
 * @property {number} height - The height of the game screen in pixels.
 * @property {number} width - The width of the game screen in pixels.
 * @property {string} parent - The ID of the HTML element to attach the game to.
 * @property {string} backgroundColor - The background color of the game.
 * @property {Object} physics - The physics settings for the game.
 * @property {Object} physics.arcade - The arcade physics configuration.
 * @property {boolean} physics.arcade.debug - Whether to enable physics debugging.
 * @property {boolean} pixelArt - Whether to enable pixel art rendering.
 * @property {Array<Phaser.Scene>} scene - The scenes used in the game.
 */

/**
 * Creates a fresh Phaser configuration object to ensure no lingering references.
 *
 * @function createConfig
 * @returns {GameConfig} The Phaser game configuration object.
 */
function createConfig() {
    return {
        type: Phaser.WEBGL,
        width: WIDTH,
        height: HEIGHT,
        parent: 'game-div',
        backgroundColor: '#000017',
        physics: {
            default: 'arcade',
            arcade: {
                debug: sharedConfig.debug,
            },
        },
        pixelArt: true,
        scene: initScenes(),
    };
}

/**
 * Initialises and starts the Phaser game with the specified configuration.
 * If a game instance already exists, it destroys the old instance before creating a new one.
 *
 * @function loadGame
 * @param {number} level - The level to load in the game.
 * @param {Object} player - The player object containing user-related data and stats.
 * @returns {void}
 */
function loadGame(level, player) {
    if (gameInstance) {
        gameInstance.destroy(true);
        gameInstance = null;
    }
    const config = createConfig();
    sharedConfig.level = level;
    sharedConfig.player = player;

    // Generate a fresh game instance with the configuration
    gameInstance = new Phaser.Game(config);
}

/**
 * Destroys the current game instance if it exists.
 * This function should be called when navigating away or returning to the level selection screen.
 *
 * @function destroyGame
 * @returns {void}
 */
function destroyGame() {
    if (gameInstance) {
        gameInstance.destroy(true);
        gameInstance = null;
    }
}

export {loadGame, destroyGame};