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

        /* Create the player and enable collision with the terrain layer */
        const survivor = this.createPlayer();
        this.createPlayerColliders(survivor, {
            colliders: {
                terrainLayer: layers.terrainLayer
            }
        });

        /* Scale up the layers and player by 4 */
        const scaleFactor = 4;
        layers.backgroundLayer.setScale(scaleFactor);
        layers.terrainLayer.setScale(scaleFactor);
        layers.foregroundLayer.setScale(scaleFactor);
        layers.decorationLayer.setScale(scaleFactor);
        survivor.setScale(scaleFactor);

        /* Get the scaled layer height */
        const layerHeight = layers.terrainLayer.height * scaleFactor;

        const offsetX = 0; // Align to the left edge
        const offsetY = (this.scale.height - layerHeight) / 2; // Center vertically

        /* Apply the same positioning to all layers */
        layers.backgroundLayer.setPosition(offsetX, offsetY);
        layers.foregroundLayer.setPosition(offsetX, offsetY);
        layers.terrainLayer.setPosition(offsetX, offsetY);
        layers.decorationLayer.setPosition(offsetX, offsetY);

        /* Set up camera to follow the player */
        this.setupCamera(survivor);

        /* Enable the lighting system and set ambient lighting */
        this.lights.enable().setAmbientColor(0xc4c4c4);

     

        layers.foregroundLayer.setPipeline('Light2D');
        layers.foregroundLayer.setTint(0x867db0);

        layers.terrainLayer.setPipeline('Light2D');
        layers.terrainLayer.setTint(0x867db0);
    }

    /* Create player with physics */
    createPlayer() {
        return new Survivor(this, 30, 20);
    }

    createPlayerColliders(survivor, {colliders}) {
        survivor.addCollider(colliders.terrainLayer);
    }

    setupCamera(survivor) {
        const {height} = this.config;
        const scaleFactor = 4; // Ensure this matches the scale used for layers

        /* Calculate the scaled map dimensions based on the original map size and scale factor */
        const scaledMapWidth = 640 * scaleFactor; // Width after scaling (640px * 4 = 2560px)
        const scaledMapHeight = 160 * scaleFactor; // Height after scaling (160px * 4 = 640px)

        /* Set world bounds and camera bounds to match the scaled map dimensions */
        this.physics.world.setBounds(0, 0, scaledMapWidth, scaledMapHeight);
        this.cameras.main.setBounds(0, 0, scaledMapWidth, scaledMapHeight);

        /* Center the camera on the player and start following */
        this.cameras.main.startFollow(survivor, true, 1, 0);
        /* Fix the Y-position of the camera to the center of the game height */
        this.cameras.main.setFollowOffset(0, (height - scaledMapHeight) / 2);
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
        terrainLayer.setCollisionByExclusion([-1]);
        return {backgroundLayer, foregroundLayer, terrainLayer, decorationLayer};
    }
}

export default Play;