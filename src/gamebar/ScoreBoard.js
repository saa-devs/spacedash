/**
 * ScoreBoard.js
 *
 * @fileOverview Defines the ScoreBoard class, which extends Phaser.GameObjects.Container.
 * The ScoreBoard is a UI component for displaying the player's score in a Phaser game.
 * It includes a text element to show the score and an image (e.g., a coin) to visually represent the score type.
 * The ScoreBoard remains fixed on the screen regardless of the player's movement.
 *
 * @module ScoreBoard
 */

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
        super(scene, x, y); // Call the parent class constructor with the scene, x, and y

        // Add this scoreboard container to the scene
        scene.add.existing(this);

        // Ensure the scoreboard remains fixed on the screen by disabling scroll factor
        this.setScrollFactor(0);

        // Set the default font size for the score text
        this.fontSize = 20;

        // Set up the visual components of the scoreboard
        this.setupList();
    }

    /**
     * Sets up the list of elements in the scoreboard
     */
    setupList() {
        // Create the scoreboard's visual elements and add them to the container
        const scoreboard = this.createScoreBoard();
        this.add(scoreboard); // Add the created scoreboard to this container
    }

    /**
     * Creates the scoreboard display
     * @returns {Phaser.GameObjects.Container} - Container with score text and image
     */
    createScoreBoard() {
        // Create and initialise the score text, with default score '0'
        this.scoreText = this.scene.add.text(0, 20, '0', {
            fontSize: `${this.fontSize}px`, // Set text size using the predefined font size
            fill: '#fff' // Set text colour to white
        });

        // Create an image of a coin to represent the score
        const scoreImage = this.scene.add.image(this.scoreText.width - 60, 15, 'blue-coin').setOrigin(0);

        // Scale the coin image for better visibility
        scoreImage.setScale(2.5);

        // Combine the score text and coin image into a container and return it
        return this.scene.add.container(0, 0, [this.scoreText, scoreImage]);
    }

    /**
     * Updates the displayed score text
     * @param {number} score - The new score to display
     */
    updateScore(score) {
        // Update the text displayed in the score text object
        this.scoreText.setText(score);
    }
}

// Export the ScoreBoard class to be used in other files
export default ScoreBoard;