'use strict';

module.exports = {
  buttons: [],
  images: [],
  data: {},

  init: function() {
  },

  preload: function() {
    // Load data from file
    this.data = require('../data/shop.js')(this);

    // Preload button sprites from data
    for (var i = 0; i < this.data.buttons.length; i++) {
      this.load.spritesheet(this.data.buttons[i].id, 
                            this.data.buttons[i].spritesheet, 
                            this.data.buttons[i].sizeX, 
                            this.data.buttons[i].sizeY, 4);
    }
    // Preload image sprites from data
    for (i = 0; i < this.data.images.length; i++) {
      this.load.spritesheet(this.data.images[i].id, 
                            this.data.images[i].spritesheet, 
                            this.data.images[i].sizeX, 
                            this.data.images[i].sizeY,
                            this.data.images[i].frames);
    }
  },

  create: function() {
    // Set background color
    this.stage.backgroundColor = '#ffffdf';

    // Create buttons from data
    for (var i = 0; i < this.data.buttons.length; i++) {
      this.buttons[this.data.buttons[i].id] = this.add.button(this.data.buttons[i].posX, 
                                                              this.data.buttons[i].posY, 
                                                              this.data.buttons[i].id, 
                                                              this.data.buttons[i].actionOnClick, this, 0, 1, 2, 3);
    }

    // Create images from data
    for (i = 0; i < this.data.images.length; i++) {
      this.images[this.data.images[i].id] = this.add.sprite(this.data.images[i].posX, 
                                                            this.data.images[i].posY, 
                                                            this.data.images[i].id);
    }
  },

  update: function() {
  }
};
