'use strict';

module.exports = [
  {
    id: 'twr_offensive',
    type: 0,
    name: 'Offensive Tower',
    range: 150,
    attackSpeed: 1000,
    damage: [30, 40],
    cost: 30,
    projectileType: 0,
    spritesheet: 'assets/game/towers/twr_offensive.png',
    action: function() {
      // Shoots a projectile
      if (this.target && this.game.time.now > this.nextFire) {
        // Calculate next time to shoot
        this.nextFire = this.game.time.now + this.attackSpeed;

        var projectile = this.projectiles.getFirstDead();
        projectile.damage = this.damage;
        projectile.reset(this.x, this.y);
        this.game.physics.arcade.moveToObject(projectile, this.target, 800);
      }
      // Reset damage
      this.damage = this.baseDamage;
      this.attackSpeed = this.baseAttackSpeed;
    },
    applyAura: function() {
    }
  },
  {
    id: 'twr_defensive',
    type: 1,
    name: 'Defensive Tower',
    range: 100,
    attackSpeed: null,
    damage: null,
    cost: 40,
    projectileType: 0,
    spritesheet: 'assets/game/towers/twr_defensive.png',
    action: function() {},
    applyAura: function() {
      this.game.enemies.forEach(function (enemy) {
        if (this.game.physics.arcade.distanceBetween(this, enemy) < this.range) {
          enemy.speed *= 0.8;
        }
      }, this);
    }
  },
  {
    id: 'twr_support',
    type: 2,
    name: 'Support Tower',
    range: 75,
    attackSpeed: null,
    damage: null,
    cost: 60,
    projectileType: 0,
    spritesheet: 'assets/game/towers/twr_support.png',
    action: function() {},
    applyAura: function() {
      this.game.towers.forEach(function (tower) {
        if (tower.attackSpeed !== null) {
          if (this.game.physics.arcade.distanceBetween(this, tower) < this.range) {
            tower.attackSpeed *= 0.8;
          }
        }
      }, this);
    }
  }
];
