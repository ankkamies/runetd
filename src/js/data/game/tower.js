'use strict';

/* Tower data
Create new towers by adding them to this file

Format:
{
  id: Tower ID,
  type: Tower type,
  name: Name of the tower,
  range: Range of the tower,
  attackSpeed: Attackspeed of the tower,
  damage: [min, max] damage of the tower,
  cost: Build cost of the tower,
  projectileType: type of projectile used by tower,
  spritesheet: path to spritesheet,
  action: Custom action of the tower,
  applyAura: Custom aura type action of the tower
*/

module.exports = [
  {
    id: 'twr_offensive',
    type: 0,
    name: 'Offensive Tower',
    range: 150,
    attackSpeed: 1000,
    damage: [30, 40],
    cost: 30,
    sockets: 4,
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
    },
    applyAura: function() {
      // Add effects from runes
      for (var i = 0; i < this.sockets.length; i++) {
        if (this.sockets[i] !== null) {
          this.sockets[i].offensiveEffect.apply(this);
        }
      }
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
    sockets: 3,
    projectileType: 0,
    spritesheet: 'assets/game/towers/twr_defensive.png',
    action: function() {
      // Apply AOE effects every second
      if (this.game.time.now > this.nextFire) {
        this.nextFire = this.game.time.now + 1000;
        this.game.enemies.forEach(function (enemy) {
          if (this.game.physics.arcade.distanceBetween(this, enemy) < this.range) {
            // Add effects from runes
            for (var i = 0; i < this.sockets.length; i++) {
              if (this.sockets[i] !== null) {
                this.sockets[i].defensiveEffect.apply(enemy, true);
              }
            }
          }
        }, this);
      }
    },
    applyAura: function() {
      this.game.enemies.forEach(function (enemy) {
        if (this.game.physics.arcade.distanceBetween(this, enemy) < this.range) {
          // Add effects from runes
          for (var i = 0; i < this.sockets.length; i++) {
            if (this.sockets[i] !== null) {
              this.sockets[i].defensiveEffect.apply(enemy);
            }
          }
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
    sockets: 2,
    projectileType: 0,
    spritesheet: 'assets/game/towers/twr_support.png',
    action: function() {},
    applyAura: function() {
      this.game.towers.forEach(function (tower) {
        if (tower.attackSpeed !== null) {
          if (this.game.physics.arcade.distanceBetween(this, tower) < this.range) {
            // Add effects from runes
            for (var i = 0; i < this.sockets.length; i++) {
              if (this.sockets[i] !== null) {
                this.sockets[i].supportEffect.apply(tower);
              }
            }
            tower.attackSpeed *= 0.8;
          }
        }
      }, this);
    }
  }
];
