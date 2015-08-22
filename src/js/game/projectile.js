'use strict';

var Phaser = require('phaser');
var data = require('../data/game/projectile.js');

function Projectile (game, x, y, type) {
  x += 16;
  y += 16;

  Phaser.Sprite.call(this, game, x, y, data[type].id);

}

// Make data accessible for preloading
Projectile.DATA = data;

Projectile.prototype = Object.create(Phaser.Sprite.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.update = function() {

};

module.exports = Projectile;
