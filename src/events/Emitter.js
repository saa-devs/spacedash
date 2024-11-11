/**
 * @fileoverview Provides a singleton instance of a Phaser EventEmitter for managing
 * custom events across the game. This instance can be used globally to handle communication
 * between different parts of the game.
 */

import Phaser from 'phaser';

/**
 * @class EventEmitter
 * @extends {Phaser.Events.EventEmitter}
 * @classdesc A singleton class extending Phaser's EventEmitter to handle custom game events.
 * This enables decoupled communication between game objects and scenes by emitting and listening
 * to events globally.
 */
class EventEmitter extends Phaser.Events.EventEmitter {
    /**
     * Creates an instance of EventEmitter, inheriting from Phaser's EventEmitter class.
     * This constructor initialises the EventEmitter without any additional properties.
     */
    constructor() {
        super();
    }
}

// Export a single instance of EventEmitter to be used globally across the game
export default new EventEmitter();