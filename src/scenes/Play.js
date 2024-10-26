import Survivor from "../sprites/Survivor";

class Play extends Phaser.Scene {
    constructor(config) {
        super('play');
        this.config = config;
        this.survivor = null;
    }

    create() {
        /* Create map and layers */
        const map = this.createMap().map;
        const tileset = this.createMap().tileset;
        const layers = this.createLayers(map, tileset);
        const levelBounds = this.getPlayerBounds(layers.levelBoundsLayer); // Start and end zones of the player

        this.scaleFactor = 4; /* How much to scale up the map by */
        /* Get the layer height and multiply by scaleFactor to get the visually rendered height   */
        const scaledLayerHeight = layers.terrainLayer.height * this.scaleFactor;

        const offsetX = 0; // Horizontal offset - move map to the left edge of the game-container
        const offsetY = 100; // Vertical offset of map

        /* Create the player and pass in offset values to position start and end zones of player */
        const survivor = this.createPlayer(layers, levelBounds.start, offsetX, offsetY);
        this.createPlayerColliders(survivor, { // Enable collision between player and terrain layer
            colliders: {
                terrainLayer: layers.terrainLayer
            }
        });

        /* Scale up all layers and player by scaleFactor (4) */
        layers.backgroundLayer.setScale(this.scaleFactor);
        layers.terrainLayer.setScale(this.scaleFactor);
        layers.foregroundLayer.setScale(this.scaleFactor);
        layers.decorationLayer.setScale(this.scaleFactor);
        survivor.setScale(this.scaleFactor);

        layers.backgroundLayer.setPosition(offsetX, 100);
        layers.foregroundLayer.setPosition(offsetX, 100);
        layers.terrainLayer.setPosition(offsetX, 100);
        layers.decorationLayer.setPosition(offsetX, 100);

        this.setupCamera(survivor, layers); /* Set up camera to follow the player */
        this.createEndOfLevel(survivor, levelBounds.end, offsetX, offsetY); /* Define end of level zone */

        /* Enable the lighting system and set ambient lighting */
        this.lights.enable().setAmbientColor(0xc4c4c4);

        layers.foregroundLayer.setPipeline('Light2D');
        layers.foregroundLayer.setTint(0x867db0);

        layers.terrainLayer.setPipeline('Light2D');
        layers.terrainLayer.setTint(0x867db0);
    }

    /* Create player */
    createPlayer(layers, start, offsetX, offsetY) {
        const startX = start.x * this.scaleFactor;
        const startY = start.y * this.scaleFactor + offsetY;
        return new Survivor(this, startX, startY);
    }

    /* Define end of level zone and console log the player has won when they overlap with the end zone */
    createEndOfLevel(survivor, end, offsetX, offsetY) {
        const endX = end.x * this.scaleFactor;
        const endY = end.y * this.scaleFactor + offsetY;
        const endOfLevel = this.physics.add.sprite(endX, endY, 'end')
            .setSize(5, 200)
            .setGravity(0, 0)
            .setOrigin(0.5, 1);

        const overlap = this.physics.add.overlap(survivor, endOfLevel, () => {
            console.log("You have won!");
            overlap.destroy(); // Disable this overlap so it only triggers once
        });
    }

    createPlayerColliders(survivor, {colliders}) {
        survivor.addCollider(colliders.terrainLayer);
    }

    setupCamera(survivor, layers) {
        const {height} = this.config;

        /* Calculate the scaled layer dimensions based on the original map size and scale factor */
        const scaledLayerWidth = layers.terrainLayer.width * this.scaleFactor;
        const scaledLayerHeight = layers.terrainLayer.height * this.scaleFactor;

        /* Set world bounds and camera bounds to match the scaled map dimensions */
        this.physics.world.setBounds(0, 0, scaledLayerWidth, scaledLayerHeight);
        this.cameras.main.setBounds(0, 0, scaledLayerWidth, scaledLayerHeight);

        /* Center the camera on the player and start following and fix the y-position of camera to center
           of the game height */
        this.cameras.main.startFollow(survivor, true, 1, 0);
        this.cameras.main.setFollowOffset(0, (height - scaledLayerHeight) / 2);
    }

    /* Return an object of start and end objects from map */
    getPlayerBounds(levelBoundsLayer) {
        return {
            start: levelBoundsLayer.objects.find(bound => bound.name === 'start'),
            end: levelBoundsLayer.objects.find(bound => bound.name === 'end')
        };
    }

    /* Create map and tileset */
    createMap() {
        const map = this.make.tilemap({key: 'tilemap'});
        const tileset = map.addTilesetImage('spacetileset', 'tileset');
        return {map, tileset};
    }

    /* Create layers for background, terrain, and decoration */
    createLayers(map, tileset) {
        const backgroundLayer = map.createLayer('background', tileset, 0, 0);
        const foregroundLayer = map.createLayer('foreground', tileset, 0, 0);
        const terrainLayer = map.createLayer('terrain', tileset, 0, 0);
        const decorationLayer = map.createLayer('decoration', tileset, 0, 0);
        const levelBoundsLayer = map.getObjectLayer('levelbounds');

        terrainLayer.setCollisionByExclusion([-1]);
        return {backgroundLayer, foregroundLayer, terrainLayer, decorationLayer, levelBoundsLayer};
    }
}

export default Play;