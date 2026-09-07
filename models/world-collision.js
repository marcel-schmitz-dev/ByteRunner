/**
 * Checks all collisions between character, enemies, and thrown projectiles.
 */
export function checkCollisions() {
    checkEnemyCollisions.call(this);
    checkProjectileCollisions.call(this);
}


/**
 * Checks collisions between the character and active enemies.
 */
export function checkEnemyCollisions() {
    const collisions = getActiveCollisions.call(this);
    const target = collisions.find(({ enemy }) =>
        isCharacterStompingEnemy.call(this, enemy),
    ) || collisions[0];

    if (target) {
        handleEnemyCollisionResponse.call(this, target.enemy, target.enemyIndex);
    }
}


/**
 * Filters all currently active character-enemy collisions.
 * @returns {Array<Object>} Array of collision objects containing enemy and index.
 */
export function getActiveCollisions() {
    return this.level.enemies
        .map((enemy, enemyIndex) => ({ enemy, enemyIndex }))
        .filter(({ enemy }) => isCharacterCollidingWith.call(this, enemy));
}


/**
 * Evaluates bounding box overlap between character and an enemy.
 * @param {Object} enemy - The target enemy entity.
 * @returns {boolean} True if intersecting.
 */
export function isCharacterCollidingWith(enemy) {
    let isCollidingX =
        this.character.x + this.character.width - 15 > enemy.x + 10 &&
        this.character.x + 15 < enemy.x + enemy.width - 10;

    let isCollidingY =
        this.character.y + this.character.height >= enemy.y &&
        this.character.y <= enemy.y + enemy.height;

    return isCollidingX && isCollidingY;
}


/**
 * Decides whether the character stomps an enemy or takes damage.
 * @param {Object} enemy - The enemy involved.
 * @param {number} enemyIndex - Index of the enemy in the level array.
 */
export function handleEnemyCollisionResponse(enemy, enemyIndex) {
    if (isCharacterStompingEnemy.call(this, enemy)) {
        processStomp.call(this, enemy, enemyIndex);
    } else if (!this.character.isHurt()) {
        let damage = this.isEndboss(enemy) ? 20 : 10;
        this.character.hit(damage);
        this.statusBar.setPercentage(this.character.energy);
    }
}


/**
 * Checks whether the character is falling onto the upper part of a regular enemy.
 * @param {Object} enemy - The target enemy entity.
 * @returns {boolean} True when the collision is a valid stomp.
 */
export function isCharacterStompingEnemy(enemy) {
    let characterBottom = this.character.y + this.character.height;
    return (
        !this.isEndboss(enemy) &&
        this.character.speedY < 0 &&
        characterBottom <= enemy.y + 30
    );
}


/**
 * Processes the successful stomp on a regular enemy.
 * @param {Object} enemy - The enemy object.
 * @param {number} enemyIndex - Index of the enemy.
 */
export function processStomp(enemy, enemyIndex) {
    this.character.y = enemy.y - this.character.height;
    this.character.speedY = 22;

    this.audioHub.play("enemiesDead", 0.5);
    this.level.enemies.splice(enemyIndex, 1);
}


/**
 * Checks if thrown discs hit active enemies or the endboss.
 */
export function checkProjectileCollisions() {
    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
        let disc = this.throwableObjects[i];
        this.level.enemies.forEach((enemy, enemyIndex) => {
            handleSingleProjectileCollision.call(this, enemy, enemyIndex, disc, i);
        });
    }
}


/**
 * Handles a potential collision between a specific projectile and an enemy.
 * @param {Object} enemy - The enemy object.
 * @param {number} enemyIndex - Index of the enemy.
 * @param {Object} disc - The projectile object.
 * @param {number} discIndex - Index of the projectile.
 */
export function handleSingleProjectileCollision(enemy, enemyIndex, disc, discIndex) {
    if (!isValidProjectileHit.call(this, enemy, disc)) return;
    this.throwableObjects.splice(discIndex, 1);
    if (this.isEndboss(enemy)) {
        inflictBossDamage.call(this, enemy);
    } else {
        this.audioHub.play("enemiesDead", 0.5);
        this.level.enemies.splice(enemyIndex, 1);
    }
}


/**
 * Validates if a throwable item can damage an enemy or the endboss.
 * @param {Object} enemy - The enemy object.
 * @param {Object} disc - The throwable projectile.
 * @returns {boolean} True if valid hit.
 */
export function isValidProjectileHit(enemy, disc) {
    let isAlive = this.isEndboss(enemy)
        ? !enemy.isDead() && enemy.isAwake
        : true;
    return isAlive && disc.isColliding(enemy);
}


/**
 * Applies damage to the endboss and updates its health bar.
 * @param {Object} enemy - The endboss instance.
 */
export function inflictBossDamage(enemy) {
    if (typeof enemy.hit === "function") {
        enemy.hit(20);
        this.bossHpBar.setPercentage(enemy.energy);
        this.audioHub.play("bossHurt", 0.5);
    }
}


/**
 * Utility method to check if an entity is the Endboss.
 * @param {Object} entity - The object to check.
 * @returns {boolean} True if constructor name matches Endboss.
 */
export function isEndboss(entity) {
    return entity.constructor.name === "Endboss";
}