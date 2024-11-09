/**
 * @fileoverview Defines the Play scene for the Phaser game.
 * The Play scene handles the game world, players, enemies, and collectables.
 */

import Survivor from '../sprites/Survivor';
import Shoot from '../attacks/Shoot'
import Collectables from '../groups/Collectables'
import Enemies from '../groups/Enemies';
import ScoreBoard from '../gamebar/ScoreBoard'

/**
 * @class Play
 * @extends {Phaser.Scene}
 * @classdesc The main game scene where gameplay occurs. It handles creating the map,
 * player, enemies, collectables, collisions, and camera setup.
 */
class Play extends Phaser.Scene {
    /**
     * Constructs the Play scene and initialises its properties.
     * @param {object} config - Configuration object for the game scene.
     */
    constructor(config) {
        super('play');
        this.config = config;
        this.scaleFactor = this.config.scaleFactor; // How much to scale up assets

        this.survivor = null; // Initialise the main player
    }

    /**
     * Called when the scene is created. Sets up the map, player, enemies, collectables, and interactions. */
    create() {
        // Create map and layers
        const map = this.createMap().map;
        const tileset = this.createMap().tileset;
        const layers = this.createLayers(map, tileset);
        const levelBounds = this.getPlayerBounds(layers.levelBoundsLayer); // Start and end zones of the sprites
        const collectables = this.createCollectables(layers.collectableLayer);

        // Create scoreboard
        this.score = 0;
        this.scoreboard = new ScoreBoard(this, 225, 90);

        // Get the layer height and multiply by scaleFactor to get the visually rendered height
        const scaledLayerHeight = layers.terrainLayer.height * this.scaleFactor;

        // Offset and scaling
        const offsetX = 0; // Horizontal offset - move map to the left edge of the game-container
        const offsetY = (this.scale.height - scaledLayerHeight) / 2; // Vertical offset - center the map vertically

        // Create the player and enemy sprites, and pass in values to position their start and end zones
        const survivor = this.createPlayer(layers, levelBounds.start, offsetX, offsetY);
        const enemies = this.createEnemies(layers.enemySpawnsLayer, offsetX, offsetY, layers.terrainLayer, survivor);

        // Player and enemy collision setup
        this.createPlayerColliders(survivor, {colliders: {terrainLayer: layers.terrainLayer,}});
        this.createPlayerOverlap(survivor, collectables);
        this.createEnemyColliders(enemies, {colliders: {terrainLayer: layers.terrainLayer, survivor}});
        this.createProjectilesCollider(survivor.projectiles, {
            colliders: {
                terrainLayer: layers.terrainLayer,
                survivor
            }
        });

        // Scale up all layers and sprites to be 4 times their size
        const layerNames = ['backgroundLayer', 'backgroundEntryLayer', 'terrainLayer', 'foregroundLayer', 'decorationLayer'];
        layerNames.forEach(layer => {
            layers[layer].setScale(this.scaleFactor);
            layers[layer].setPosition(offsetX, offsetY);
        });

        // Apply lighting to main layers
        Object.keys(layers).forEach(layer => {
            if (layer === 'decorationLayer' || layer === 'backgroundEntryLayer') {
                return;
            }
            if (layers[layer] && layers[layer].setPipeline) {
                layers[layer].setPipeline('Light2D');
            }
        });

        this.setupCamera(survivor, layers); // Set up camera to follow the player
        this.createEndOfLevel(survivor, levelBounds.end, offsetX, offsetY); // Define end of level zone

        // Enable lighting system and set a dark ambient color to simulate a cave
        this.lights.enable().setAmbientColor(0x504978);
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
        const backgroundEntryLayer = map.createLayer('backgroundentry', tileset, 0, 0);
        const foregroundLayer = map.createLayer('foreground', tileset, 0, 0);
        const terrainLayer = map.createLayer('terrain', tileset, 0, 0);
        const decorationLayer = map.createLayer('decoration', tileset, 0, 0);
        const levelBoundsLayer = map.getObjectLayer('levelbounds');
        const enemySpawnsLayer = map.getObjectLayer('enemyspawns');
        const collectableLayer = map.getObjectLayer('collectables');

        // Enable collision for terrain layer
        terrainLayer.setCollisionByExclusion([-1]);
        return {
            backgroundLayer,
            backgroundEntryLayer,
            foregroundLayer,
            terrainLayer,
            decorationLayer,
            levelBoundsLayer,
            enemySpawnsLayer,
            collectableLayer,
        };
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
     * Creates and positions collectable items based on the specified layer.
     * @param {Phaser.Tilemaps.ObjectLayer} collectablesLayer - The layer containing collectable object data from the tilemap.
     * @returns {Collectables} The created `Collectables` group with all items positioned as defined in the layer.
     */
    createCollectables(collectablesLayer) {
        const collectables = new Collectables(this);
        collectables.addFromLayer(collectablesLayer, this.scaleFactor);
        return collectables;
    }

    /**
     * Creates the survivor character at the specified start position.
     * @param {object} layers - The game layers.
     * @param {object} start - The starting position for the player.
     * @param {number} offsetX - The horizontal offset for positioning.
     * @param {number} offsetY - The vertical offset for positioning.
     * @returns {Survivor} The survivor character instance.
     */
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

    /**
     * Sets up collision detection for the player with specified colliders.
     * Adds a collider for the player with the terrain layer, allowing the player to interact with it.
     * @param survivor - The player character instance.
     * @param colliders - An object containing layers and objects to collide with.
     * @param colliders.terrainLayer - The terrain layer for player collisions.
     */
    createPlayerColliders(survivor, {colliders}) {
        survivor.addCollider(colliders.terrainLayer);
    }

    /**
     * Sets up overlap detection between the player and collectable items.
     * When the player overlaps with a collectable item, the `onCollect` callback is triggered.
     * @param {Survivor} survivor - The player character instance.
     * @param {Collectables} collectables - The group of collectable items in the game.
     */
    createPlayerOverlap(survivor, collectables) {
        this.physics.add.overlap(survivor, collectables, this.onCollect, null, this);
    }

    /**
     * Sets up colliders for the enemies with specified layers and objects.
     * @param enemies - The group of enemies.
     * @param colliders - An object containing layers and objects to collide with.
     */
    createEnemyColliders(enemies, {colliders}) {
        enemies
            .addCollider(colliders.terrainLayer)
            .addCollider(colliders.survivor, this.onSurvivorCollision.bind(this)) /* Play this.onSurvivorCollision whenever there is
            collision between the enemy and survivor */
            .addCollider(colliders.survivor.projectiles, this.onShoot); /* Play onShoot() callback function when collision happens
            between survivors weapon and the enemy */
    }

    /**
     * Sets up collision detection for projectiles with the specified colliders.
     * When a projectile collides with the terrain layer, it triggers the projectile's collision handler.
     * @param {Phaser.GameObjects.Group} projectiles - The group of projectiles to check for collisions.
     * @param {object} colliders - An object containing layers and objects to collide with.
     * @param colliders.terrainLayer - The terrain layer used for projectile collisions.
     */
    createProjectilesCollider(projectiles, {colliders}) {
        this.physics.add.collider(projectiles, colliders.terrainLayer, (projectile) => {
            // Ensure that the projectile is an instance of Shoot, then handle the collision
            if (projectile instanceof Shoot) {
                projectile.handleCollision();
            }
        });
    }

    /**
     * Callback function for when an enemy collides with the survivor.
     * @param {Phaser.GameObjects.Sprite} enemy - The enemy that collided with the survivor.
     * @param {Survivor} survivor - The player character.
     */
    onSurvivorCollision(enemy, survivor) {
        survivor.handleHit(enemy);
    }

    /**
     * Callback function to run when a projectile hits an enemy.
     * @param enemy - The enemy that was hit.
     * @param source - The source of the projectile.
     */
    onShoot(enemy, source) {
        enemy.takeDamage(source);
    }

    /**
     * Callback function for when the survivor collects an item.
     * @param survivor - The player character.
     * @param collectable - The collected item.
     */
    onCollect(survivor, collectable) {
        this.score += collectable.score;
        this.scoreboard.updateScore(this.score); // Update the score on the scoreboard
        collectable.disableBody(true, true);
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