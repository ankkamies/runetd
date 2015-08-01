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
                              data.buttons[i].sizeX, 
                              data.buttons[i].sizeY, 4);
      }
      // Preload image sprites from data
      for (i = 0; i < data.images.length; i++) {
        this.load.spritesheet(data.images[i].id, 
                              data.images[i].spritesheet, 
                              data.images[i].sizeX, 
                              data.images[i].sizeY,
                              data.images[i].frames);
      }
    },

    create: function() {
      // Set background color
      this.stage.backgroundColor = '#ffffdf';

      // Create buttons from data
      for (var i = 0; i < data.buttons.length; i++) {
        this.buttons[data.buttons[i].id] = this.add.button(data.buttons[i].posX, 
                                                          data.buttons[i].posY, 
                                                          data.buttons[i].id, 
                                                          data.buttons[i].actionOnClick, 
                                                          this, 0, 1, 2, 3);
      }

      // Create images from data
      for (i = 0; i < data.images.length; i++) {
        this.images[data.images[i].id] = this.add.sprite(data.images[i].posX, 
                                                         data.images[i].posY, 
                                                         data.images[i].id);
      }
    },

    update: function() {
    }
  };
};
