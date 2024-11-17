/**
 * @fileoverview Defines the Play scene for the Phaser game.
 * Handles the game world, players, enemies, collectables, and interactions.
 */

import Survivor from '../sprites/Survivor';
import Shoot from '../attacks/Shoot';
import Collectables from '../groups/Collectables';
import Enemies from '../groups/Enemies';
import ScoreBoard from '../gamebar/ScoreBoard';
import EventEmitter from '../events/Emitter';
import {createGameOver} from "../../scripts/controller/gameOverController";

/**
 * @class Play
 * @extends {Phaser.Scene}
 * @classdesc The main game scene where gameplay occurs. It handles creating the map,
 * player, enemies, collectables, collisions, and camera setup.
 */
class Play extends Phaser.Scene {
    /**
     * Constructs the Play scene and initializes its properties.
     * @param {object} config - Configuration object for the game scene.
     * @param {number} config.level - The current game level.
     * @param {number} config.scaleFactor - Scaling factor for game assets.
     * @param {number} config.height - Game container height.
     */
    constructor(config) {
        super('play');
        this.config = config;
        this.scaleFactor = this.config.scaleFactor;
        this.survivor = null;
    }

    /** Sets up the map, player, enemies, collectables, and interactions when the scene is created. */
    create() {
        this.startTime = this.time.now;
        const map = this.createMap().map;
        const tileset = this.createMap().tileset;
        const layers = this.createLayers(map, tileset);
        const levelBounds = this.getPlayerBounds(layers.levelBoundsLayer);
        const collectables = this.createCollectables(layers.collectableLayer);

        this.score = 0;
        this.scoreboard = new ScoreBoard(this, 225, 90);

        const scaledLayerHeight = layers.terrainLayer.height * this.scaleFactor;
        const offsetX = 0;
        const offsetY = (this.scale.height - scaledLayerHeight) / 2;

        const survivor = this.createPlayer(layers, levelBounds.start, offsetX, offsetY);
        const { enemies, enemyCount } = this.createEnemies(
            layers.enemySpawnsLayer,
            offsetX,
            offsetY,
            layers.terrainLayer,
            survivor
        );

        this.enemies = enemies;
        this.enemyCount = enemyCount;

        this.createPlayerColliders(survivor, { colliders: { terrainLayer: layers.terrainLayer } });
        this.createPlayerOverlap(survivor, collectables);
        this.createEnemyColliders(enemies, { colliders: { terrainLayer: layers.terrainLayer, survivor } });
        this.createProjectilesCollider(survivor.projectiles, {
            colliders: { terrainLayer: layers.terrainLayer, survivor },
        });

        ['backgroundLayer', 'backgroundEntryLayer', 'terrainLayer', 'foregroundLayer', 'decorationLayer'].forEach(layer => {
            layers[layer].setScale(this.scaleFactor);
            layers[layer].setPosition(offsetX, offsetY);
        });

        Object.keys(layers).forEach(layer => {
            if (layer !== 'decorationLayer' && layer !== 'backgroundEntryLayer' && layers[layer].setPipeline) {
                layers[layer].setPipeline('Light2D');
            }
        });

        this.setupCamera(survivor, layers);
        this.createEndOfLevel(survivor, enemies, levelBounds.end, offsetX, offsetY);
        this.lights.enable().setAmbientColor(0x504978);

        this.createGameEvent();
    }

    /** Registers a custom game event to handle player loss. */
    createGameEvent() {
        EventEmitter.off('PLAYER_LOOSE');
        EventEmitter.on('PLAYER_LOOSE', async () => {
            await this.gameLost(this.enemies);
        });
    }

    /**
     * Creates the map and loads the tileset based on the game level.
     * @returns {object} An object containing the map and tileset.
     */
    createMap() {
        let map = null;
        let tileset = null;
        if (this.config.level === 1) {
            map = this.make.tilemap({ key: 'level-one' });
        } else if (this.config.level === 2) {
            map = this.make.tilemap({ key: 'level-two' });
        }
        if (map) {
            tileset = map.addTilesetImage('spacetileset', 'tileset');
        }
        return { map, tileset };
    }

    /**
     * Creates all layers for the game map.
     * @param {object} map - The tilemap object.
     * @param {object} tileset - The tileset object.
     * @returns {object} An object containing all created layers.
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
     * @param {Phaser.Tilemaps.ObjectLayer} levelBoundsLayer - The layer containing level bounds.
     * @returns {object} An object with start and end positions.
     */
    getPlayerBounds(levelBoundsLayer) {
        return {
            start: levelBoundsLayer.objects.find(bound => bound.name === 'start'),
            end: levelBoundsLayer.objects.find(bound => bound.name === 'end'),
        };
    }

    /**
     * Creates collectable items based on the specified layer.
     * @param {Phaser.Tilemaps.ObjectLayer} collectablesLayer - The layer with collectable object data.
     * @returns {Collectables} A group of collectable items.
     */
    createCollectables(collectablesLayer) {
        const collectables = new Collectables(this);
        collectables.addFromLayer(collectablesLayer, this.scaleFactor);
        return collectables;
    }

    /**
     * Creates the survivor character at the specified position.
     * @param {object} layers - Game layers.
     * @param {object} start - Starting position of the player.
     * @param {number} offsetX - Horizontal offset for positioning.
     * @param {number} offsetY - Vertical offset for positioning.
     * @returns {Survivor} The survivor character instance.
     */
    createPlayer(layers, start, offsetX, offsetY) {
        const startX = start.x * this.scaleFactor;
        const startY = start.y * this.scaleFactor + offsetY;
        return new Survivor(this, startX, startY);
    }

    /**
     * Creates enemies based on spawn positions in the specified layer.
     * @param {Phaser.Tilemaps.ObjectLayer} enemySpawnsLayer - The layer with enemy spawn points.
     * @param {number} offsetX - Horizontal offset for positioning.
     * @param {number} offsetY - Vertical offset for positioning.
     * @param {object} terrainLayer - The terrain layer for collision.
     * @param {Survivor} survivor - The player character.
     * @returns {{enemyCount: number, enemies: Enemies}} A group of enemies and their count.
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
        return { enemies, enemyCount };
    }

    /**
     * Sets up collision detection for the player with specified colliders.
     * @param {Survivor} survivor - The player character.
     * @param {object} colliders - Colliders to interact with.
     */
    createPlayerColliders(survivor, { colliders }) {
        survivor.addCollider(colliders.terrainLayer);
    }

    /**
     * Sets up overlap detection between the player and collectables.
     * @param {Survivor} survivor - The player character.
     * @param {Collectables} collectables - Group of collectable items.
     */
    createPlayerOverlap(survivor, collectables) {
        this.physics.add.overlap(survivor, collectables, this.onCollect, null, this);
    }

    /**
     * Sets up colliders for enemies with specified layers and objects.
     * @param {Enemies} enemies - Group of enemies.
     * @param {object} colliders - Colliders to interact with.
     */
    createEnemyColliders(enemies, { colliders }) {
        enemies
            .addCollider(colliders.terrainLayer)
            .addCollider(colliders.survivor, this.onSurvivorCollision.bind(this))
            .addCollider(colliders.survivor.projectiles, this.onShoot);
    }

    /**
     * Sets up collision detection for projectiles with specified colliders.
     * @param {Phaser.GameObjects.Group} projectiles - Group of projectiles.
     * @param {object} colliders - Colliders to interact with.
     */
    createProjectilesCollider(projectiles, { colliders }) {
        this.physics.add.collider(projectiles, colliders.terrainLayer, projectile => {
            if (projectile instanceof Shoot) {
                projectile.handleCollision();
            }
        });
    }

    /** Handles collision between an enemy and the player character. */
    onSurvivorCollision(enemy, survivor) {
        survivor.handleHit(enemy);
    }

    /** Handles the event of a projectile hitting an enemy. */
    onShoot(enemy, source) {
        enemy.takeDamage(source);
    }

    /** Handles the collection of an item by the player. */
    onCollect(survivor, collectable) {
        this.score += collectable.score;
        this.scoreboard.updateScore(this.score);
        collectable.disableBody(true, true);
    }

    /**
     * Sets up the camera to follow the player and defines its bounds.
     * @param {Survivor} survivor - The player character.
     * @param {object} layers - Game layers.
     */
    setupCamera(survivor, layers) {
        const { height } = this.config;
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
     * @param {Enemies} enemies - Group of enemies in the level.
     * @param {object} end - End position of the level.
     * @param {number} offsetX - Horizontal offset for positioning.
     * @param {number} offsetY - Vertical offset for positioning.
     */
    createEndOfLevel(survivor, enemies, end, offsetX, offsetY) {
        const endX = end.x * this.scaleFactor;
        const endY = end.y * this.scaleFactor + offsetY;

        const endOfLevel = this.physics.add.sprite(endX, endY, 'end')
            .setSize(5, 1000)
            .setGravity(0, 0)
            .setOrigin(0.5, 1);

        this.gameWon(survivor, enemies, endOfLevel);
    }

    /**
     * Handles the logic when the game is won.
     * @param {Survivor} survivor - The player character.
     * @param {Enemies} enemies - Group of enemies in the level.
     * @param {Phaser.GameObjects.Sprite} endOfLevel - The end-of-level object.
     */
    gameWon(survivor, enemies, endOfLevel) {
        const level = this.config.level;
        const overlap = this.physics.add.overlap(survivor, endOfLevel, async () => {
            let totalDefeatedEnemies = 0;
            enemies.getChildren().forEach(enemy => {
                totalDefeatedEnemies += enemy.deadCount;
            });

            if (totalDefeatedEnemies === this.enemyCount) {
                console.log("You have won!");
                this.scene.stop('play');
                this.game.canvas.parentNode.removeChild(this.game.canvas);

                const endTime = this.time.now;
                const timeTaken = ((endTime - this.startTime) / 1000).toFixed(1);
                overlap.destroy();
                await createGameOver(true, this.score, totalDefeatedEnemies, level, timeTaken);
            }
        });
    }

    /**
     * Handles the logic when the game is lost.
     * @param {Enemies} enemies - Group of enemies in the level.
     */
    async gameLost(enemies) {
        const level = this.config.level;
        console.log('You have lost the game');
        this.scene.stop('play');
        this.game.canvas.parentNode.removeChild(this.game.canvas);

        let totalDefeatedEnemies = 0;
        enemies.getChildren().forEach(enemy => {
            totalDefeatedEnemies += enemy.deadCount;
        });
        await createGameOver(false, this.score, totalDefeatedEnemies, level, 0);
    }
}

export default Play;