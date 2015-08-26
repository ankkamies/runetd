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
  this.stats = game.add.text(970, 200, '', style);
}

UI.prototype.update = function() {
  this.updateCursor();
  this.updateStatusText();
};

UI.prototype.updateStatusText = function() {
  // Update stats text if mouse is over a tower
  if (this.game.cursor.tile !== null) {
    if (this.game.cursor.tile.tower) {
      this.stats.text = '';
      this.stats.text += 'Name: ' + this.game.cursor.tile.tower.name + '\n';
      this.stats.text += 'Range: ' + this.game.cursor.tile.tower.range + '\n';
      if (this.game.cursor.tile.tower.damage !== null) {
        this.stats.text += 'Damage: ' + this.game.cursor.tile.tower.damage[0] + '-' +
        this.game.cursor.tile.tower.damage[1] + '\n';
      }
      if (this.game.cursor.tile.tower.attackSpeed !== null) {
        this.stats.text += 'Attack speed: ' + this.game.cursor.tile.tower.attackSpeed + '\n';
      }
    } else {
      this.stats.text = '';
    }
  }
};

UI.prototype.updateCursor = function() {
 // TODO: Move cursor update logic here 
};

module.exports = UI;
