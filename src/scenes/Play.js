/**
 * @fileoverview Defines the Play scene for the Phaser game.
 * The Play scene handles creating the game world, player and enemies.
 */

import Survivor from '../sprites/Survivor';
import Enemies from '../groups/Enemies';

/**
 * @class Play
 * @extends {Phaser.Scene}
 * @classdesc The main game scene where gameplay occurs. It handles creating the map,
 * player, enemies, collisions, and camera setup.
 */
class Play extends Phaser.Scene {
    /**
     * Constructs the Play scene and initialises its properties.
     * @param {object} config - Configuration object for the game scene.
     */
    constructor(config) {
        super('play');
        this.config = config;
        this.survivor = null;
    }

    /**
     * Called when the scene is created. Sets up the map, player, enemies, and interactions.
     */
    create() {
        // Create map and layers
        const map = this.createMap().map;
        const tileset = this.createMap().tileset;
        const layers = this.createLayers(map, tileset);
        const levelBounds = this.getPlayerBounds(layers.levelBoundsLayer); // Start and end zones of the sprites

        this.scaleFactor = 4; // How much to scale up the map by

        // Get the layer height and multiply by scaleFactor to get the visually rendered height
        const scaledLayerHeight = layers.terrainLayer.height * this.scaleFactor;

        const offsetX = 0; // Horizontal offset - move map to the left edge of the game-container
        const offsetY = (this.scale.height - scaledLayerHeight) / 2; // Vertical offset - center the map vertically

        // Create the player and enemy sprites, and pass in values to position their start and end zones
        const survivor = this.createPlayer(layers, levelBounds.start, offsetX, offsetY);
        const enemies = this.createEnemies(layers.enemySpawnsLayer, offsetX, offsetY, layers.terrainLayer, survivor);

        // Enable player collision with terrain layer
        this.createPlayerColliders(survivor, {
            colliders: {
                terrainLayer: layers.terrainLayer
            }
        });

        // Enable enemy collision with terrain layer and the player
        this.createEnemyColliders(enemies, {
            colliders: {
                terrainLayer: layers.terrainLayer, survivor
            }
        });

        // Scale up all layers and sprites to be 4 times their size
        const layerNames = ['backgroundLayer', 'terrainLayer', 'foregroundLayer', 'decorationLayer'];
        layerNames.forEach(layerName => {
            layers[layerName].setScale(this.scaleFactor);
        });

        // Set position of all layers
        layerNames.forEach(layerName => {
            layers[layerName].setPosition(offsetX, offsetY);
        });

        this.setupCamera(survivor, layers); // Set up camera to follow the player
        this.createEndOfLevel(survivor, levelBounds.end, offsetX, offsetY); // Define end of level zone

        // Enable the lighting system and set ambient lighting
        this.lights.enable().setAmbientColor(0xc4c4c4);

        layers.foregroundLayer.setPipeline('Light2D');
        layers.foregroundLayer.setTint(0x867db0);

        layers.terrainLayer.setPipeline('Light2D');
        layers.terrainLayer.setTint(0x867db0);
    }

    /**
     * Creates the map and loads the tileset.
     * @returns {object} An object containing the map and tileset.
     */
    createMap() {
        const map = this.make.tilemap({key: 'tilemap'});
        const tileset = map.addTilesetImage('spacetileset', 'tileset');
        return {map, tileset};
    }

    /**
     * Creates all layers for the game map.
     * @param {object} map - The tilemap object.
     * @param {object} tileset - The tileset object.
     * @returns {object} An object containing all the created layers.
     */
    createLayers(map, tileset) {
        const backgroundLayer = map.createLayer('background', tileset, 0, 0);
        const foregroundLayer = map.createLayer('foreground', tileset, 0, 0);
        const terrainLayer = map.createLayer('terrain', tileset, 0, 0);
        const decorationLayer = map.createLayer('decoration', tileset, 0, 0);
        const levelBoundsLayer = map.getObjectLayer('levelbounds');
        const enemySpawnsLayer = map.getObjectLayer('enemyspawns');

        // Enable collision detection for all tiles in the terrainLayer, except for tiles with the index -1.
        // The index -1 represents empty tiles or tiles that don't exist
        terrainLayer.setCollisionByExclusion([-1]);
        return {backgroundLayer, foregroundLayer, terrainLayer, decorationLayer, levelBoundsLayer, enemySpawnsLayer};
    }

    /**
     * Gets the start and end positions for the player from the level bounds layer.
     * @param {object} levelBoundsLayer - The layer containing level bounds.
     * @returns {object} An object containing the start and end positions.
     */
    getPlayerBounds(levelBoundsLayer) {
        // Finds all the objects in this layer that has the name 'start' and 'end' and returns these in on object
        return {
            start: levelBoundsLayer.objects.find(bound => bound.name === 'start'),
            end: levelBoundsLayer.objects.find(bound => bound.name === 'end')
        };
    }

    /**
     * Creates the survivor character at the specified start position.
     * @param {object} layers - The game layers.
     * @param {object} start - The starting position for the player.
     * @param {number} offsetX - The horizontal offset for positioning.
     * @param {number} offsetY - The vertical offset for positioning.
     * */
    createPlayer(layers, start, offsetX, offsetY) {
        const startX = start.x * this.scaleFactor;
        const startY = start.y * this.scaleFactor + offsetY;
        return new Survivor(this, startX, startY);
    }

    /**
     * For each object on the enemy spawn layer, create a new enemy with the specified position, add terrain layer
     * collider, and add the enemy to enemies group
     * @param {object} enemySpawnsLayer - The layer containing enemy spawn points.
     * @param {number} offsetX - The horizontal offset for positioning.
     * @param {number} offsetY - The vertical offset for positioning.
     * @param {object} terrainLayer - The terrain layer for setting collision.
     * @param survivor
     * @returns {Enemies} - The group of created enemies.
     */
    createEnemies(enemySpawnsLayer, offsetX, offsetY, terrainLayer, survivor) {
        const enemies = new Enemies(this);
        const enemyTypes = enemies.getTypes();

        enemySpawnsLayer.objects.forEach((spawnPoint) => {
            const startX = spawnPoint.x * this.scaleFactor;
            const startY = spawnPoint.y * this.scaleFactor + offsetY;
            const enemy = new enemyTypes[spawnPoint.type](this, startX, startY, survivor);
            enemy.setTerrainColliders(terrainLayer);
            enemies.add(enemy);
        });
        return enemies;
    }

    createPlayerColliders(survivor, {colliders}) {
        survivor.addCollider(colliders.terrainLayer);
    }

    createEnemyColliders(enemies, {colliders}) {
        enemies
            .addCollider(colliders.terrainLayer)
            .addCollider(colliders.survivor, this.onSurvivorCollision.bind(this))
            .addCollider(colliders.survivor.projectiles, this.onShoot);
    }

    onShoot(enemy, source) {
        enemy.takeDamage(source);
    }

    onSurvivorCollision(enemy, survivor) {
        survivor.handleHit(enemy);
    }

    /**
     * Sets up the camera to follow the player and sets the camera bounds.
     * @param {Survivor} survivor - The player character.
     * @param {object} layers - The game layers.
     */
    setupCamera(survivor, layers) {
        const {height} = this.config;

        // Calculate the scaled layer dimensions based on the original map size and scale factor */
        const scaledLayerWidth = layers.terrainLayer.width * this.scaleFactor;
        const scaledLayerHeight = layers.terrainLayer.height * this.scaleFactor;

        // Set world bounds and camera bounds to match the scaled map dimensions */
        this.physics.world.setBounds(0, 0, scaledLayerWidth, scaledLayerHeight);
        this.cameras.main.setBounds(0, 0, scaledLayerWidth, scaledLayerHeight);

        /* Center the camera on the sprites and start following and fix the y-position of camera to center
           of the game height */
        this.cameras.main.startFollow(survivor, true, 1, 0);
        this.cameras.main.setFollowOffset(0, (height - scaledLayerHeight) / 2);
    }

    /**
     * Defines the end-of-level zone and logs a win message when the player reaches it.
     * @param {Survivor} survivor - The player character.
     * @param {object} end - The end position for the level.
     * @param {number} offsetX - The horizontal offset for positioning.
     * @param {number} offsetY - The vertical offset for positioning.
     */
    createEndOfLevel(survivor, end, offsetX, offsetY) {
        const endX = end.x * this.scaleFactor;
        const endY = end.y * this.scaleFactor + offsetY;

        // Create a sprite to represent end of level in map
        const endOfLevel = this.physics.add.sprite(endX, endY, 'end')
            .setSize(5, 200)
            .setGravity(0, 0)
            .setOrigin(0.5, 1);

        const overlap = this.physics.add.overlap(survivor, endOfLevel, () => {
            console.log("You have won!");
            overlap.destroy(); // Disable this overlap so it only triggers once
        });
    }
}

export default Play;