/**
 * @fileoverview A class representing a group of enemies in the game. This class manages multiple enemy objects and
 * includes collision features by using the `collidable` mixin.
 */

import Phaser from 'phaser';
import {ENEMY_TYPES} from '../spriteTypes/enemyTypes';
import collidable from '../mixins/collidable';

class Enemies extends Phaser.GameObjects.Group {
    /**
     * @constructor
     * @param {Phaser.Scene} scene - The scene this group of enemies belongs to.
     */
    constructor(scene) {
        super(scene);
        /**
         * Adds collision properties and methods from the collidable mixin.
         */
        Object.assign(this, collidable);
    }

    /**
     * Returns the different types of enemies available.
     * @returns {Array|Object} - The list or object of enemy types.
     */
    getTypes() {
        return ENEMY_TYPES;
    }
}

export default Enemies;