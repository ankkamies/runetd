'use strict';

var Phaser = require('phaser');
var data = require('../data/game/tower.js');
var Projectile = require('./projectile.js');

function Tower (game, x, y, type) {
  x += 16;
  y += 16;

  Phaser.Sprite.call(this, game, x, y, data[type].id);
  this.anchor.setTo(0.5, 0.5);

  // Set tower properties
  this.baseRange = data[type].range;
  this.baseAttackSpeed = data[type].attackSpeed;
  this.action = data[type].action;
  this.applyAura = data[type].applyAura;
  this.baseDamage = data[type].damage;

  // Copy damage values from baseDamage so it does not use a reference
  if (this.baseDamage !== null) {
    this.damage[0] = this.baseDamage[0];
    this.damage[1] = this.baseDamage[1];
  } else {
    this.damage = null;
  }

  this.attackSpeed = this.baseAttackSpeed;
  this.range = this.baseRange;
  this.projectileType = data[type].projectileType;
  this.value = data[type].cost;
  this.name = data[type].name; 
  this.type = type;

  // Initialize values
  this.assignedTarget = null;
  this.target = null;
  this.nextFire = 0;

  // Create empty sockets
  this.sockets = [];
  for (var i = 0; i < data[type].sockets; i++) {
    this.sockets.push(null);
  }

  // Add range circle
  this.rangeCircle = this.game.add.graphics();

  // Add mouseover events for displaying rangeCircle
  this.inputEnabled = true;
  this.events.onInputOver.add(function() {this.createRangeCircle();}, this);
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

Tower.prototype.preUpdate = function() {
  // Reset stats before every update to prevent auras from stacking
  if (this.damage !== null) {
    this.damage[0] = this.baseDamage[0];
    this.damage[1] = this.baseDamage[1];
  }

  this.range = this.baseRange;
  this.attackSpeed = this.baseAttackSpeed;
};

Tower.prototype.update = function() {
  // Apply auras or shoot, depending if the tower can have a target
  this.applyAura();

  if (this.assignedTarget) {
    this.target = this.assignedTarget;
  }
  // Check if current target is out of range or dead
  if (this.target) {
    if (this.game.math.distance(this.x, this.y, this.target.x, this.target.y) > this.range || !this.target.alive) {
      this.target = null;
      this.assignedTarget = null;
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
};

Tower.prototype.postUpdate = function() {
  // Shoot after everything has been updated so auras get applied
  this.action();
};

Tower.prototype.createRangeCircle = function() {
  // Circle for displaying towers range
  this.rangeCircle.clear();
  this.rangeCircle.lineStyle(2, 0x000000, 1);
  this.rangeCircle.drawCircle(this.x, this.y, this.range * 2);
  this.rangeCircle.visible = true;
};

Tower.prototype.socketRune = function(rune) {
  for (var i = 0; i < this.sockets.length; i++) {
    if (this.sockets[i] === null) {
      this.sockets[i] = rune;
      return true;
    }
  }
  return false;
};

module.exports = Tower;
