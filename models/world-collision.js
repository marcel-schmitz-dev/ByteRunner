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
    this.level.enemies.forEach((enemy, enemyIndex) => {
        if (isCharacterCollidingWith.call(this, enemy)) {
            handleEnemyCollisionResponse.call(this, enemy, enemyIndex);
        }
    });
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
    let isEndboss = enemy.constructor.name === "Endboss";
    let characterBottom = this.character.y + this.character.height;
    let isFalling = this.character.speedY < 0;
    let isJumpingOnTop =
        !isEndboss && isFalling && characterBottom <= enemy.y + 30;

    if (isJumpingOnTop) {
        processStomp.call(this, enemyIndex);
    } else if (!this.character.isHurt()) {
        let damage = isEndboss ? 20 : 10;
        this.character.hit(damage);
        this.statusBar.setPercentage(this.character.energy);
    }
}

/**
 * Processes the successful stomp on a regular enemy.
 * @param {number} enemyIndex - Index of the enemy.
 */
export function processStomp(enemyIndex) {
    this.character.speedY = 22;
    this.character.isBouncing = true;

    setTimeout(() => {
        this.character.isBouncing = false;
    }, 300);

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
            if (isValidProjectileHit.call(this, enemy, disc)) {
                this.throwableObjects.splice(i, 1); 

                if (this.isEndboss(enemy)) {
                    inflictBossDamage.call(this, enemy);
                } else {
                    this.audioHub.play("enemiesDead", 0.5);
                    this.level.enemies.splice(enemyIndex, 1);
                }
            }
        });
    }
}

/**
 * Validates if a throwable item can damage an enemy or the endboss.
 * @param {Object} enemy - The enemy object.
 * @param {Object} disc - The throwable projectile.
 * @returns {boolean} True if valid hit.
 */
export function isValidProjectileHit(enemy, disc) {
    let isAlive = this.isEndboss(enemy) ? (!enemy.isDead() && enemy.isAwake) : true;
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