/**
 * @fileoverview Defines the Play scene for the Phaser game.
 * The Play scene handles the game world, players, enemies, and collectables.
 */

import Survivor from '../sprites/Survivor';
import Shoot from '../attacks/Shoot';
import Collectables from '../groups/Collectables';
import Enemies from '../groups/Enemies';
import ScoreBoard from '../gamebar/ScoreBoard';
import EventEmitter from '../events/Emitter';
import gameWon from "../../scripts/view/gameOverView";

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
        this.scaleFactor = this.config.scaleFactor; // Scaling factor for game assets
        this.survivor = null; // Initialises the main
    }

    /**
     * Called when the scene is created. Sets up the map, player, enemies, collectables, and interactions.
     */
    create() {
        this.startTime = this.time.now;
        const map = this.createMap().map;
        const tileset = this.createMap().tileset;
        const layers = this.createLayers(map, tileset);
        const levelBounds = this.getPlayerBounds(layers.levelBoundsLayer); // Start and end zones of the player
        const collectables = this.createCollectables(layers.collectableLayer);

        // Create scoreboard
        this.score = 0;
        this.scoreboard = new ScoreBoard(this, 225, 90);

        const scaledLayerHeight = layers.terrainLayer.height * this.scaleFactor;
        const offsetX = 0; // Horizontal offset - aligns map to the left edge of the game container
        const offsetY = (this.scale.height - scaledLayerHeight) / 2; // Vertical offset - centers the map vertically

        const survivor = this.createPlayer(layers, levelBounds.start, offsetX, offsetY);
        const {
            enemies,
            enemyCount
        } = this.createEnemies(layers.enemySpawnsLayer, offsetX, offsetY, layers.terrainLayer, survivor);

        this.enemyCount = enemyCount;

        this.createPlayerColliders(survivor, {colliders: {terrainLayer: layers.terrainLayer}});
        this.createPlayerOverlap(survivor, collectables);
        this.createEnemyColliders(enemies, {colliders: {terrainLayer: layers.terrainLayer, survivor}});
        this.createProjectilesCollider(survivor.projectiles, {
            colliders: {
                terrainLayer: layers.terrainLayer,
                survivor,
            },
        });

        // Scale up all layers and position them with offsets
        ['backgroundLayer', 'backgroundEntryLayer', 'terrainLayer', 'foregroundLayer', 'decorationLayer'].forEach(layer => {
            layers[layer].setScale(this.scaleFactor);
            layers[layer].setPosition(offsetX, offsetY);
        });

        // Apply lighting to main layers
        Object.keys(layers).forEach(layer => {
            if (layer !== 'decorationLayer' && layer !== 'backgroundEntryLayer' && layers[layer].setPipeline) {
                layers[layer].setPipeline('Light2D');
            }
        });

        this.setupCamera(survivor, layers);
        this.createEndOfLevel(survivor, enemies, levelBounds.end, offsetX, offsetY);
        this.lights.enable().setAmbientColor(0x504978); // Simulate a cave with ambient lighting

        this.createGameEvent();
    }

    /** Registers a custom game event that logs a message when triggered. */
    createGameEvent() {
        EventEmitter.on('PLAYER_LOOSE', () => {
            console.log('PLAYER_LOOSE');
        });
    }

    /**
     * Creates the map and loads the tileset.
     * @returns {object} An object containing the map and tileset.
     */
    createMap() {
        let map = null;
        let tileset = null;
        if (this.config.level === 1) {
            map = this.make.tilemap({key: 'level-one'});
        } else if (this.config.level === 2) {
            map = this.make.tilemap({key: 'level-two'});
        }
        if (map) {
            tileset = map.addTilesetImage('spacetileset', 'tileset');
        }
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

        // Enable collision for the terrain layer
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
     * Retrieves the start and end positions for the player from the level bounds layer.
     * @param {object} levelBoundsLayer - The layer containing level bounds.
     * @returns {object} An object containing the start and end positions.
     */
    getPlayerBounds(levelBoundsLayer) {
        return {
            start: levelBoundsLayer.objects.find(bound => bound.name === 'start'),
            end: levelBoundsLayer.objects.find(bound => bound.name === 'end'),
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
     * Creates enemies based on spawn positions in the specified layer.
     * @param {object} enemySpawnsLayer - The layer containing enemy spawn points.
     * @param {number} offsetX - The horizontal offset for positioning.
     * @param {number} offsetY - The vertical offset for positioning.
     * @param {object} terrainLayer - The terrain layer for setting collision.
     * @param {Survivor} survivor - The player character to target.
     * @returns {{enemyCount: number, enemies: Enemies}} - The group of created enemies.
     */
    createEnemies(enemySpawnsLayer, offsetX, offsetY, terrainLayer, survivor) {
        const enemies = new Enemies(this);
        const enemyTypes = enemies.getTypes();
        let enemyCount = 0;

        enemySpawnsLayer.objects.forEach(spawnPoint => {
            const startX = spawnPoint.x * this.scaleFactor;
            const startY = spawnPoint.y * this.scaleFactor + offsetY;
            const enemy = new enemyTypes[spawnPoint.type](this, startX, startY, survivor);
            enemy.setTerrainColliders(terrainLayer);
            enemies.add(enemy);
            enemyCount++;
        });
        return {enemies, enemyCount};
    }

    /** Sets up collision detection for the player with specified colliders. */
    createPlayerColliders(survivor, {colliders}) {
        survivor.addCollider(colliders.terrainLayer);
    }

    /**
     * Sets up overlap detection between the player and collectable items.
     * @param {Survivor} survivor - The player character instance.
     * @param {Collectables} collectables - The group of collectable items.
     */
    createPlayerOverlap(survivor, collectables) {
        this.physics.add.overlap(survivor, collectables, this.onCollect, null, this);
    }

    /** Sets up colliders for enemies with specified layers and objects. */
    createEnemyColliders(enemies, {colliders}) {
        enemies
            .addCollider(colliders.terrainLayer)
            .addCollider(colliders.survivor, this.onSurvivorCollision.bind(this))
            .addCollider(colliders.survivor.projectiles, this.onShoot);
    }

    /**
     * Sets up collision detection for projectiles with the specified colliders.
     * @param {Phaser.GameObjects.Group} projectiles - The group of projectiles to check for collisions.
     * @param {object} colliders - An object containing layers and objects to collide with.
     */
    createProjectilesCollider(projectiles, {colliders}) {
        this.physics.add.collider(projectiles, colliders.terrainLayer, projectile => {
            if (projectile instanceof Shoot) {
                projectile.handleCollision();
            }
        });
    }

    /** Callback for when an enemy collides with the survivor. */
    onSurvivorCollision(enemy, survivor) {
        survivor.handleHit(enemy);
    }

    /** Callback to handle when a projectile hits an enemy. */
    onShoot(enemy, source) {
        enemy.takeDamage(source);
    }

    /** Callback for when the survivor collects an item. */
    onCollect(survivor, collectable) {
        this.score += collectable.score;
        this.scoreboard.updateScore(this.score);
        collectable.disableBody(true, true);
    }

    /** Sets up the camera to follow the player and defines camera bounds. */
    setupCamera(survivor, layers) {
        const {height} = this.config;
        const scaledLayerWidth = layers.terrainLayer.width * this.scaleFactor;
        const scaledLayerHeight = layers.terrainLayer.height * this.scaleFactor;

        this.physics.world.setBounds(0, 0, scaledLayerWidth, scaledLayerHeight);
        this.cameras.main.setBounds(0, 0, scaledLayerWidth, scaledLayerHeight);
        this.cameras.main.startFollow(survivor, true, 1, 0);
        this.cameras.main.setFollowOffset(0, (height - scaledLayerHeight) / 2);
    }

    /**
     * Defines the end-of-level zone and triggers an event when the player reaches it.
     * @param {Survivor} survivor - The player character.
     * @param enemies
     * @param {object} end - The end position for the level.
     * @param {number} offsetX - The horizontal offset for positioning.
     * @param {number} offsetY - The vertical offset for positioning.
     */
    createEndOfLevel(survivor, enemies, end, offsetX, offsetY) {
        const endX = end.x * this.scaleFactor;
        const endY = end.y * this.scaleFactor + offsetY;

        const endOfLevel = this.physics.add.sprite(endX, endY, 'end')
            .setSize(5, 200)
            .setGravity(0, 0)
            .setOrigin(0.5, 1);

        const overlap = this.physics.add.overlap(survivor, endOfLevel, () => {
            let totalDefeatedEnemies = 0;
            enemies.getChildren().forEach(enemy => {
                totalDefeatedEnemies += enemy.deadCount;
            });

            if (totalDefeatedEnemies === this.enemyCount) {
                const endTime = this.time.now; // Capture the end time
                const timeTaken = ((endTime - this.startTime) / 1000).toFixed(1); // Calculate time in seconds
                console.log("You have won!");
                console.log(`Time taken: ${timeTaken}s`);
                console.log(`You scored: ${this.score} points`);
                gameWon();
                overlap.destroy();
            }
        });
    }
}

export default Play;