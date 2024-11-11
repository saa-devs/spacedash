/**
 * @fileoverview This mixin provides animation-related utility methods for game objects.
 * It enhances game objects with a method to check if a specific animation is currently playing.
 */

export default {
    /**
     * Checks if the specified animation is currently playing on this game object.
     * @param {string} animsKey - The key of the animation to check.
     * @returns {boolean} - Returns true if the specified animation is currently playing, false otherwise.
     */
    isPlayingAnims(animsKey) {
        // Check if an animation is playing and if it matches the specified key
        return this.anims.isPlaying && this.anims.currentAnim && this.anims.currentAnim.key === animsKey;
    }
}