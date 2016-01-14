'use strict';

module.exports = function() {
  return {
    buttons: [],
    stageButtons: [],
    images: [],
    stages: [],

    init: function() {
      this.data = require('../data/stages.js')(this);
      this.stages = require('../data/game/stages.js');
    },

    preload: function() {
      // Preload button sprites from data
      for (var i = 0; i < this.data.buttons.length; i++) {
        this.load.spritesheet(this.data.buttons[i].id, 
                              this.data.buttons[i].spritesheet, 
                              this.data.buttons[i].size.x, 
                              this.data.buttons[i].size.y, 4);
      }
      // Preload image sprites from data
      for (i = 0; i < this.data.images.length; i++) {
        this.load.spritesheet(this.data.images[i].id, 
                              this.data.images[i].spritesheet, 
                              this.data.images[i].size.x, 
                              this.data.images[i].size.y,
                              this.data.images[i].frames);
      }
      // Preload stagebutton
      this.load.spritesheet(this.data.stageButton.id,
                            this.data.stageButton.spritesheet,
                            this.data.stageButton.size.x,
                            this.data.stageButton.size.y, 4);
    },

    create: function() {
      // Set background color
      this.stage.backgroundColor = '#ffffdf';

      // Create buttons from data
      for (var i = 0; i < this.data.buttons.length; i++) {
        this.buttons[this.data.buttons[i].id] = this.add.button(this.data.buttons[i].pos.x, 
                                                                this.data.buttons[i].pos.y, 
                                                                this.data.buttons[i].id, 
                                                                this.data.buttons[i].actionOnClick, 
                                                                this, 0, 1, 2, 3);
      }

      // Create stage buttons from data
      for (i = 0; i < this.stages.length; i++) {
        this.stageButtons[i] = this.add.button(450 + i * 130, 350,
                                               this.data.stageButton.id, 
                                               this.createCallback(this.stages[i]), 
                                               this, 0, 1, 2, 3);

      }

      // Create images from data
      for (i = 0; i < this.data.images.length; i++) {
        this.images[this.data.images[i].id] = this.add.sprite(this.data.images[i].pos.x, 
                                                              this.data.images[i].pos.y, 
                                                              this.data.images[i].id);
      }
    },

    createCallback: function(stage) {
      return function() {
        this.game.state.start('game', true, true, stage);
      };
    },

    update: function() {
    }
  };
};
