'use strict';

var Phaser = require('phaser');
var Tower = require('../game/tower.js');

function UI(game) {
  this.game = game;
  this.data = require('../data/game/ui.js')(game);
  this.buttons = [];
  this.buildButtons = [];
  this.towerImages = [];
  this.cursor = {};

  // Preload button sprites from data
  for (var i = 0; i < this.data.buttons.length; i++) {
    this.game.load.spritesheet(this.data.buttons[i].id, 
                               this.data.buttons[i].spritesheet, 
                               this.data.buttons[i].size.x, 
                               this.data.buttons[i].size.y,
                               this.data.buttons[i].frames.length);
  }

  // Preload image sprites from data
  for (i = 0; i < this.data.images.length; i++) {
    this.game.load.spritesheet(this.data.images[i].id, 
                               this.data.images[i].spritesheet, 
                               this.data.images[i].size.x, 
                               this.data.images[i].size.y,
                               this.data.images[i].frames);
  }

  // Preload tower frame
  this.game.load.spritesheet(this.data.towerFrame.id, 
                             this.data.towerFrame.spritesheet,
                             this.data.towerFrame.size.x,
                             this.data.towerFrame.size.y,
                             this.data.towerFrame.frames.length);

}

UI.prototype.create = function() {
  // Define text style
  var style = {
    font: '16px Arial',
    fill: '#ffffff',
    align: 'left'
  };

  // Create buttons from data
  for (var i = 0; i < this.data.buttons.length; i++) {
    this.buttons[this.data.buttons[i].id] = this.game.add.button(this.data.buttons[i].pos.x, 
                                                            this.data.buttons[i].pos.y, 
                                                            this.data.buttons[i].id, 
                                                            this.data.buttons[i].actionOnClick, null,
                                                            this.data.buttons[i].frames[0],
                                                            this.data.buttons[i].frames[1],
                                                            this.data.buttons[i].frames[2],
                                                            this.data.buttons[i].frames[3]);
  }

  // Create images from data
  /* TODO: Move UI images to somewhere else so this can be used to create only game related images
  for (i = 0; i < this.data.images.length; i++) {
    this.images[this.data.images[i].id] = this.add.sprite(this.data.images[i].pos.x, 
                                                          this.data.images[i].pos.y, 
                                                          this.data.images[i].id);
  }
  */
  // Create tower buttons from tower data
  for (i = 0; i < Tower.DATA.length; i++) {
    this.buildButtons[i] = this.game.add.button(this.data.towerFrame.pos.x + 55 * i,
                                           this.data.towerFrame.pos.y,
                                           this.data.towerFrame.id,
                                           this.data.towerFrame.actionOnClick, null);

    this.buildButtons[i].tower = Tower.DATA[i];
    this.buildButtons[i].events.onInputOver.add(this.game.createCallback(Tower.DATA[i]), this.game);
    this.buildButtons[i].events.onInputOut.add(this.clearStatusText, this);

    this.towerImages[i] = this.game.add.sprite(this.data.towerFrame.pos.x + 55 * i + 9,
                                          this.data.towerFrame.pos.y + 9,
                                          Tower.DATA[i].id);
  }

  // Create cursor rectangle
  this.cursor = this.game.add.graphics();
  this.cursor.lineStyle(2, 0x000000, 1);
  this.cursor.beginFill(0xB0B0B0, 0.5);
  this.cursor.drawRect(0, 0, 32, 32);
  this.cursor.endFill();
  this.cursor.visible = false;

  // Create status text
  this.stats = this.game.add.text(970, 160, '', style); 

  // Create inventory
  this.inventory = [];

  for (i = 0; i < 4; i++) {
    this.inventory[i] = [];
    for(var j = 0; j < 6; j++) {
      this.inventory[i][j] = {};
      this.inventory[i][j].sprite = this.game.add.sprite(967 + i * 42, 300 + j * 42, 'img_invslot');
    }
  }

};

UI.prototype.update = function() {
  this.updateCursor();
  this.updateBuildButtons();
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

UI.prototype.updateBuildButtons = function() {
  for (var i = 0; i < this.buildButtons.length; i++) {
    if (this.buildButtons[i].tower === this.game.buildTower) {
      this.buildButtons[i].frame = 1;
    } else {
      this.buildButtons[i].frame = 0;
    }
  }
};

UI.prototype.updateCursor = function() {
  // Get tile from game area
  this.cursor.tile = this.game.map.getTile(this.game.layers.background.getTileX(this.game.input.activePointer.worldX),
                                           this.game.layers.background.getTileY(this.game.input.activePointer.worldY));

  // update cursor position if tile was found
  if (this.cursor.tile !== null) {
    // set tile x and y to cursor
    this.cursor.x = this.cursor.tile.x * 32;
    this.cursor.y = this.cursor.tile.y * 32;

    if (this.game.buildPhase && this.game.buildTower !== null) {
      this.cursor.visible = true;
      // tint the cursor green or red
      if (this.cursor.tile.properties.buildable && !this.cursor.tile.hasEnemies && !this.cursor.tile.tower) {
        this.cursor.tint = 0x00ff00;
      } else {
        this.cursor.tint = 0xff0000;
      }
      if (this.cursor.tile.properties.blocksPath) {
        this.cursor.tint = 0xff0000;
      } else if (this.cursor.tile !== this.cursor.lastTile) {
        if (this.game.isPathBlocked(this.cursor.tile.x, this.cursor.tile.y)) {
          this.cursor.tint = 0xff0000;
          this.cursor.tile.properties.blocksPath = true;
        }
      }
      this.cursor.lastTile = this.cursor.tile;
    } else {
      // hide cursor if not building
      this.cursor.visible = false;
    }
  } else {
    // hide cursor when not over game area
    this.cursor.visible = false;
  }
};

module.exports = UI;
