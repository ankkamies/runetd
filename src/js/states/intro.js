'use strict';

module.exports = {
  images: [],
  text: [],
  twns: [],
  data: {},

  init: function() {
  },

  preload: function() {
    // Initialize arrays
    this.images = [];
    this.text = [];
    this.twns = [];

    // Load data from file
    this.data = require('../data/intro.js')(this);

    // Preload image sprites from data
    for (var i = 0; i < this.data.images.length; i++) {
      this.load.spritesheet(this.data.images[i].id, 
                            this.data.images[i].spritesheet, 
                            this.data.images[i].size.x, 
                            this.data.images[i].size.y,
                            this.data.images[i].frames);
    }
  },

  create: function() {
    // Set background color
    this.stage.backgroundColor = '#ffffdf';

    // Create images from data
    for (var i = 0; i < this.data.images.length; i++) {
      this.images.push(this.add.sprite(this.data.images[i].pos.x, 
                                       this.data.images[i].pos.y, 
                                       this.data.images[i].id));
    }

    // Create text from data
    for (i = 0; i < this.data.text.length; i++) {
      this.text.push(this.add.text(this.data.text[i].pos.x, 
                                   this.data.text[i].pos.y, 
                                   this.data.text[i].text,
                                   this.data.text[i].style));

      // If text has animations, add them as tweens
      if (this.data.text[i].tween) {
        this.twns.push(this.add.tween(this.text[i]).to(this.data.text[i].tween.properties,
                                                       this.data.text[i].tween.duration,
                                                       this.data.text[i].tween.ease,
                                                       this.data.text[i].tween.autoStart,
                                                       this.data.text[i].tween.delay,
                                                       this.data.text[i].tween.repeat,
                                                       this.data.text[i].tween.yoyo));
      }
    }

    // Add timer for intro
    this.time.events.add(20000, this.stopIntro, this);

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

  stopIntro: function() {
    // Unbind events
    this.input.keyboard.onDownCallback = null;
    this.input.mouse.mouseDownCallback = null;

    // Start main menu state
    this.state.start('main');
  }
};
