'use strict';

var Phaser = require('phaser');
var data = require('../data/game.js');

function UI(game) {
  var style = {
    font: '16px Arial',
    fill: '#ffffff',
    align: 'left'
  };
  // TODO: Move cursor & ui button creation here
  this.game = game;
  this.stats = game.add.text(970, 160, '', style); 

  // Make a group for inventory
  this.inventory = [];
  for (var i = 0; i < 4; i++) {
    this.inventory[i] = [];
    for(var j = 0; j < 6; j++) {
      this.inventory[i][j] = {};
      this.inventory[i][j].sprite = this.game.add.sprite(967 + i * 42, 300 + j * 42, 'img_invslot');
    }
  }
}

UI.prototype.update = function() {
  this.updateCursor();
  this.updateStatusText();
};

UI.prototype.setStatusText = function(entity) {
  // TODO: Make stuff happen here
  this.stats.text = '';
  this.stats.text += 'Name: ' + entity.name + '\n';
  if (entity.cost) {
    this.stats.text += 'Price: ' + entity.cost + '\n';
  }
  if (entity.range) {
   this.stats.text += 'Range: ' + entity.range + '\n';
  }
  if (entity.damage) {
    if (entity.damage[0]) {
      this.stats.text += 'Damage: ' + entity.damage[0] + '-' + entity.damage[1] + '\n';
    }
  }
  if (entity.attackSpeed) {
    this.stats.text += 'Attack speed: ' + entity.attackSpeed + '\n';
  }
  if (entity.health > 1) {
    this.stats.text += 'Health: ' + entity.health + '\n';
  }
  if (entity.speed) {
    this.stats.text += 'Speed: ' + entity.speed + '\n';
  }
};

UI.prototype.clearStatusText = function() {
  this.stats.text = '';
};

UI.prototype.updateStatusText = function() {
  // Update stats text if mouse is over a tower

/*
if (this.game.cursor.tile !== null) {
    if (this.game.cursor.tile.tower) {
      this.setStatusText(this.game.cursor.tile.tower);
    } else {
      // this.stats.text = '';
    }
  }
*/
};

UI.prototype.updateCursor = function() {
 // TODO: Move cursor update logic here 
};

module.exports = UI;
