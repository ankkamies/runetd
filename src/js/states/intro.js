'use strict';

module.exports = {
  buttons: [],
  images: [],
  data: {},

  init: function() {
  },

  preload: function() {
    // Load data from file
    this.data = require('../data/intro.js')(this);

    // Preload image sprites from data
    for (var i = 0; i < this.data.images.length; i++) {
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

    // Create images from data
    for (var i = 0; i < this.data.images.length; i++) {
      this.images[this.data.images[i].id] = this.add.sprite(this.data.images[i].posX, 
                                                            this.data.images[i].posY, 
                                                            this.data.images[i].id);
    }

    // Add timer for intro
    this.time.events.add(8000, this.stopIntro, this);

    // Add 'Press any key' event
    var that = this;
    this.input.keyboard.onDownCallback = function (event) {
      this.stopIntro();
    }.bind(that);

    this.input.mouse.mouseDownCallback = function (event) {
      this.stopIntro();
    }.bind(that);

  },

  update: function() {
  },

  stopIntro: function () {
    // Unbind events
    this.input.keyboard.onDownCallback = null;
    this.input.mouse.mouseDownCallback = null;

    // Start menu state
    this.state.start('main');
  }
};
