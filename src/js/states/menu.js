'use strict';

module.exports = function(data) {
  return {
    buttons: [],
    images: [],

    init: function() {
    },

    preload: function() {
      // Preload button sprites from data
      for (var i = 0; i < data.buttons.length; i++) {
        this.load.spritesheet(data.buttons[i].id, 
                              data.buttons[i].spritesheet, 
                              data.buttons[i].size.x, 
                              data.buttons[i].size.y, 4);
      }
      // Preload image sprites from data
      for (i = 0; i < data.images.length; i++) {
        this.load.spritesheet(data.images[i].id, 
                              data.images[i].spritesheet, 
                              data.images[i].size.x, 
                              data.images[i].size.y,
                              data.images[i].frames);
      }
    },

    create: function() {
      // Set background color
      this.stage.backgroundColor = '#ffffdf';

      // Create buttons from data
      for (var i = 0; i < data.buttons.length; i++) {
        this.buttons[data.buttons[i].id] = this.add.button(data.buttons[i].pos.x, 
                                                           data.buttons[i].pos.y, 
                                                           data.buttons[i].id, 
                                                           data.buttons[i].actionOnClick, 
                                                           this, 0, 1, 2, 3);
      }

      // Create images from data
      for (i = 0; i < data.images.length; i++) {
        this.images[data.images[i].id] = this.add.sprite(data.images[i].pos.x, 
                                                         data.images[i].pos.y, 
                                                         data.images[i].id);
      }
    },

    update: function() {
    }
  };
};
