/* This mixin file defines collision behavior for reusability - collidable can be attached to game objects like
   players and enemies */
export default {
    addCollider(otherGameObject, callback) {
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
    }
}