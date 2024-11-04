class HealthBar {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.currentHealth = 6; // Start with full health (3 full circles)

        // Array to store the health icons
        this.healthIcons = [];

        // Create and display the initial full health icons
        this.createHealthIcons();
    }

    // Method to create and display the health icons
    createHealthIcons() {
        for (let i = 0; i < 3; i++) { // We have 3 circles to represent the health
            const icon = this.scene.add.sprite(this.x + (i * 32), this.y, 'hp'); // Positioned 32px apart
            icon.setScale(4); // Scale up the icons by 4
            icon.setFrame(0); // Start with frame 0 (full circle)
            icon.setScrollFactor(0); // Keep the icons fixed relative to the camera
            this.healthIcons.push(icon); // Store the icon in the array
        }
    }

    // Method to update the health bar when the player takes damage
    takeDamage() {
        if (this.currentHealth > 0) {
            this.currentHealth--; // Reduce health by 1 (half a circle)

            // Update the frames based on the current health
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
