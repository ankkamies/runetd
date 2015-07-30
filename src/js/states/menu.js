'use strict';

module.exports = {
  buttons: [],

  init: function() {
  },

  preload: function() {
    // Preload button sprites from datafile
    var btnData = require('../data/buttons.js');
    for (var i = 0; i < btnData.length; i++) {
      this.load.spritesheet(btnData[i].id, btnData[i].spritesheet, btnData[i].sizeX, btnData[i].sizeY, 4);
    }
  },

  create: function() {
    // Set background color
    this.stage.backgroundColor = '#ffffdf';

    // Create buttons from datafile
    var btnData = require('../data/buttons.js');
    for (var i = 0; i < btnData.length; i++) {
      this.buttons[btnData[i].id] = this.add.button(btnData[i].posX, btnData[i].posY, btnData[i].id, btnData[i].actionOnClick, this, 0, 1, 2, 3);
    }
  },

  update: function() {
  },

  handleButtonClick: function() {
  }
};
