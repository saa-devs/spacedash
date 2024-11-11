import Phaser from 'phaser';

// Define ScoreBoard class extending Phaser's GameObjects.Container
class ScoreBoard extends Phaser.GameObjects.Container {
    /**
     * Constructor to initialise the scoreboard container
     * @param {Phaser.Scene} scene - The scene to which the scoreboard belongs
     * @param {number} x - X position of the scoreboard
     * @param {number} y - Y position of the scoreboard
     */
    constructor(scene, x, y) {
        super(scene, x, y);

        scene.add.existing(this); // Add scoreboard to scene
        this.setScrollFactor(0); // Keep it fixed on the screen
        this.fontSize = 20;

        this.setupList();
    }

    /** Sets up the list of elements in the scoreboard */
    setupList() {
        // Create the scoreboard display and add it to the container
        const scoreboard = this.createScoreBoard();
        this.add(scoreboard);
    }

    /**
     * Creates the scoreboard display
     * @returns {Phaser.GameObjects.Container} - Container with score text and image
     */
    createScoreBoard() {
        // Create score text and save a reference to it for updating later
        this.scoreText = this.scene.add.text(0, 20, '0', {
            fontSize: `${this.fontSize}px`,
            fill: '#fff'
        });

        // Create a coin image next to the score text
        const scoreImage = this.scene.add.image(this.scoreText.width - 60, 15, 'blue-coin').setOrigin(0);
        scoreImage.setScale(2.5); // Scale the coin image for better visibility

        return this.scene.add.container(0, 0, [this.scoreText, scoreImage]);
    }

    /**
     * Updates the displayed score text
     * @param {number} score - The new score to display
     */    updateScore(score) {
        this.scoreText.setText(score);
    }
}

export default ScoreBoard;