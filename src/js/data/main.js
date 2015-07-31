'use strict';

module.exports = function(game) {
  return {
    buttons: [
    { 
      id: 'btn_play',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      sizeX: 100,
      sizeY: 50,
      posX: 350,
      posY: 250,
      actionOnClick: function() {
        game.state.start('stages');
      }
    },
    { 
     id: 'btn_shop',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      sizeX: 100,
      sizeY: 50,
      posX: 350,
      posY: 350,
      actionOnClick: function() {
        game.state.start('shop');
      }
    },
    { 
     id: 'btn_settings',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      sizeX: 100,
      sizeY: 50,
      posX: 350,
      posY: 450,
      actionOnClick: function() {
        game.state.start('settings');
      }
    },
    {
      id: 'btn_intro',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      sizeX: 100,
      sizeY: 50,
      posX: 0,
      posY: 550,
      actionOnClick: function() {
        game.state.start('intro');
      }
    }],

    images: [
    {
      id: 'img_logo',
      spritesheet: 'assets/ui/images/img_logo.png',
      sizeX: 400,
      sizeY: 100,
      posX: 200,
      posY: 100,
      frames: 1
    }],

    text: [
    {

    }]
  };
};
