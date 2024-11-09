/**
 * @fileoverview Defines the HealthBar class, which displays and manages the player's health using icon-based
 * health indicators. The health bar visually represents the player's remaining health with full, half, and empty circles.
 */

class HealthBar {
    /**
     * Creates an instance of the HealthBar.
     * @param {Phaser.Scene} scene - The scene to which this health bar belongs.
     * @param {number} x - The x-coordinate of the health bar's position.
     * @param {number} y - The y-coordinate of the health bar's position.
     */
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.currentHealth = 6; // Start with full health (3 full circles)
        this.healthIcons = []; // Array to store the health icons

        // Create and display the initial full health icons
        this.createHealthIcons();
    }

    /**
     * Creates and displays the health icons representing the player's health.
     * Each icon represents one health "circle" and starts as a full circle.
     */
    createHealthIcons() {
        for (let i = 0; i < 3; i++) { // We have 3 circles to represent the health
            const icon = this.scene.add.sprite(this.x + (i * 32), this.y, 'hp'); // Position each icon 32px apart
            icon.setScale(3.5); // Scale up the icons by 4 for visibility
            icon.setFrame(0); // Start with frame 0 (full circle)
            icon.setScrollFactor(0); // Fix the icons relative to the camera
            this.healthIcons.push(icon); // Store the icon in the array
        }
    }

    /**
     * Updates the health bar when the player takes damage by adjusting the health icons.
     * Icons show a full, half, or empty circle based on the player's remaining health.
     */
    takeDamage() {
        if (this.currentHealth > 0) {
            this.currentHealth--; // Reduce health by 1 (half a circle)

            // Update the frames of each icon based on the current health
            for (let i = 0; i < 3; i++) { // Loop through each of the 3 icons
                if (this.currentHealth >= (i + 1) * 2) {
                    this.healthIcons[i].setFrame(0); // Full circle (frame 0)
                } else if (this.currentHealth === (i * 2) + 1) {
                    this.healthIcons[i].setFrame(1); // Half circle (frame 1)
                } else {
                    this.healthIcons[i].setFrame(2); // Empty circle (frame 2)
                }
            }
        }
    }
}

export default HealthBar;