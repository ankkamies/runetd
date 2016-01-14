'use strict';

var Phaser = require('phaser');
var data = require('../data/game/runes.js');

function Rune (game, x, y, type) {
  Phaser.Sprite.call(this, game, 967, 300, data[type].id);

  this.name = data[type].name;
  this.offensiveEffect = data[type].offensiveEffect;
  this.defensiveEffect = data[type].defensiveEffect;
  this.supportEffect = data[type].supportEffect;

  this.damage = null;

}

// Make data accessible for preloading
Rune.DATA = data;

Rune.prototype = Object.create(Phaser.Sprite.prototype);
Rune.prototype.constructor = Rune;

Rune.prototype.update = function() {

};

module.exports = Rune;
