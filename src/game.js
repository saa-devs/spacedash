import Phaser from 'phaser';
import Play from './scenes/Play';
import Init from './scenes/Init';

/* Game dimensions */
const width = 800;
const height = 425;

/* Shared configurations between scenes */
const sharedConfig = {
    width: width,
    height: height,
}

const Scenes = [Init, Play]; /* Array of Scene classes */

/* For each scene, create an instance and pass in the configurations to its constructor */
const createScene = Scene => new Scene(sharedConfig);
const initScenes = () => Scenes.map(createScene);

/* Game configuration settings */
const config = {
    type: Phaser.AUTO,
    height: height,
    width: width,
    parent: 'game-container', /* Attach to #game-container element */
    backgroundColor: '#000017',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 500
            },
            debug: true,
        },
    },
    pixelArt: true,
    scene: initScenes() /* Return an array of initialised scenes */
};

/* Function to start the game with the defined configurations */
export function loadGame() {
    new Phaser.Game(config);
}