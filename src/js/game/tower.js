'use strict';

var Phaser = require('phaser');
var data = require('../data/game/tower.js');
var Projectile = require('./projectile.js');

function Tower (game, x, y, type) {
  x += 16;
  y += 16;

  Phaser.Sprite.call(this, game, x, y, data[type].id);

  // Set tower properties
  this.range = data[type].range;
  this.baseAttackSpeed = data[type].attackSpeed;
  this.action = data[type].action;
  this.baseDamage = data[type].damage;
  this.damage = this.baseDamage;
  this.attackSpeed = this.baseAttackSpeed;
  this.projectileType = data[type].projectileType;
  this.value = data[type].cost;

  // Initialize values
  this.target = null;
  this.nextFire = 0;

  // Circle for displaying towers range
  this.rangeCircle = this.game.add.graphics();
  this.rangeCircle.lineStyle(2, 0x000000, 1);
  this.rangeCircle.drawCircle(this.x, this.y, this.range * 2);
  this.rangeCircle.visible = false;

  // Add mouseover events for displaying rangeCircle
  this.inputEnabled = true;
  this.events.onInputOver.add(function() {this.rangeCircle.visible = true;}, this);
  this.events.onInputOut.add(function() {this.rangeCircle.visible = false;}, this);

  // Create a subgroup for projectiles of this tower
  this.projectiles = this.game.add.group();
  this.projectiles.enableBody = true;
  this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;

  // Create 50 projectiles that will be revived when shooting
  this.projectiles.createMultiple(50, Projectile.DATA[this.projectileType].id);
  this.projectiles.setAll('checkWorldBounds', true);
  this.projectiles.setAll('outOfBoundsKill', true);
}

// Make data accessible for preloading
Tower.DATA = data;

Tower.prototype = Object.create(Phaser.Sprite.prototype);
Tower.prototype.constructor = Tower;

Tower.prototype.update = function() {
  // Check if current target is out of range or dead
  if (this.target) {
    if (this.game.math.distance(this.x, this.y, this.target.x, this.target.y) > this.range || !this.target.alive) {
      this.target = null;
    }
  } else {
    for(var i = 0; i < this.game.enemies.children.length; i++) {
      // Search for enemies in range and set target to first alive one found
      if (this.game.math.distance(this.x, this.y, this.game.enemies.children[i].x, this.game.enemies.children[i].y) < this.range) {
        if (this.game.enemies.children[i].alive) {
          this.target = this.game.enemies.children[i];
          break;
        } else {
          this.target = null;
        }
      }
    }
  }

  // Perform the action assigned to this tower
  this.action();
};

module.exports = Tower;
