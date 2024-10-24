import Survivor from "../sprites/Survivor";

class Play extends Phaser.Scene {
    constructor(config) {
        super('play');
        this.survivor = null;
    }

    create() {
        /* Create map and layers */
        const map = this.createMap().map;
        const tileset = this.createMap().tileset;
        const layers = this.createLayers(map, tileset);

        /* Create the player and enable collision with the terrain layer */
        const survivor = this.createPlayer();
        this.physics.add.collider(survivor, layers.terrainLayer);

        /* Set scale of layers */
        const scaleFactor = 4;
        layers.backgroundLayer.setScale(scaleFactor);
        layers.terrainLayer.setScale(scaleFactor);
        layers.decorationLayer.setScale(scaleFactor);
        survivor.setScale(scaleFactor);

        /* Get the scaled layer height */
        const layerHeight = layers.terrainLayer.height * scaleFactor;

        const offsetX = 0; // Align to the left edge
        const offsetY = (this.scale.height - layerHeight) / 3; // Center vertically

        /* Apply the same positioning to all layers */
        layers.backgroundLayer.setPosition(offsetX, offsetY);
        layers.terrainLayer.setPosition(offsetX, offsetY);
        layers.decorationLayer.setPosition(offsetX, offsetY);

        /* Enable the lighting system and set ambient lighting */
        this.lights.enable().setAmbientColor(0xa6a6a6);

        /* Apply lighting/tint to terrain/background layers */
        layers.backgroundLayer.setPipeline('Light2D');
        layers.terrainLayer.setPipeline('Light2D');
        layers.terrainLayer.setTint(0x867db0);
    }

    /* Create player with physics */
    createPlayer() {
        return new Survivor(this, 100, 250);
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
        const terrainLayer = map.createLayer('terrain', tileset, 0, 0);
        const decorationLayer = map.createLayer('decoration', tileset, 0, 0);
        terrainLayer.setCollisionByExclusion([-1]);
        return {backgroundLayer, terrainLayer, decorationLayer};
    }
}

export default Play;