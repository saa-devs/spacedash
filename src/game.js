/**
 * @fileoverview This file sets up the main configuration for the Phaser game and initialises scenes.
 */

import Phaser from 'phaser';
import Play from './scenes/Play';
import Init from './scenes/Init';

/** @constant {number} WIDTH - The width of the game screen in pixels */
const WIDTH = 1000;

/** @constant {number} HEIGHT - The height of the game screen in pixels */
const HEIGHT = 700;

/**
 * @typedef {Object} SharedConfig
 * @property {number} width - The width of the game screen
 * @property {number} height - The height of the game screen
 */

/**
 * @type {SharedConfig}
 * @description Shared configurations used across different game scenes
 */
const sharedConfig = {
    width: WIDTH,
    height: HEIGHT,
    scaleFactor: 4,
    debug: true
}

/** @constant {Array<Phaser.Scene>} Scenes - An array of scene classes used in the game */
const Scenes = [Init, Play];

/**
 * Creates a new instance of a scene and passes shared configurations to it
 * @function
 * @param {Function} Scene - The scene class to initialise
 * @returns {Phaser.Scene} - An instance of the scene
 */
const createScene = Scene => new Scene(sharedConfig);

/**
 * Iterates over every scene from array of scenes and initialises them
 * @function
 * @returns {Array<Phaser.Scene>} - An array of initialised scene instances
 */
const initScenes = () => Scenes.map(createScene);

/**
 * @typedef {Object} GameConfig
 * @property {number} type - The rendering type for the game
 * @property {number} height - The height of the game screen in pixels
 * @property {number} width - The width of the game screen in pixels
 * @property {string} parent - The ID of the HTML element to attach the game to
 * @property {string} backgroundColor - The background color of the game
 * @property {Object} physics - The physics settings for the game
 * @property {boolean} physics.debug - Whether to enable physics debugging
 * @property {boolean} pixelArt - Whether to enable pixel art rendering
 * @property {Array<Phaser.Scene>} scene - The scenes used in the game
 */

/**
 * @type {GameConfig}
 * @description The main configuration object for the Phaser game
 */
const config = {
    type: Phaser.WEBGL,
    height: HEIGHT,
    width: WIDTH,
    parent: 'game-div', // Attach to #game-div element
    backgroundColor: '#000017',
    physics: {
        default: 'arcade',
        arcade: {
            debug: sharedConfig.debug,
        },
    },
    pixelArt: true,
    scene: initScenes() // Return an array of initialised scenes
};

/**
 * Initialises and starts the Phaser game with the specified configuration
 * @function
 */
export function loadGame() {
    new Phaser.Game(config);
}