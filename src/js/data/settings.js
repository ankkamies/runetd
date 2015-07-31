'use strict';

module.exports = function(game) {
  return {
    buttons: [
    { 
      id: 'btn_toggle_audio',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      sizeX: 100,
      sizeY: 50,
      posX: 50,
      posY: 300,
      actionOnClick: function() {
        console.log('TODO: Make settings');
      }
    },
    { 
     id: 'btn_return',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      sizeX: 100,
      sizeY: 50,
      posX: 700,
      posY: 550,
      actionOnClick: function() {
        game.state.start('main');
      }
    }],

    images: [
    {
      id: 'img_settings',
      spritesheet: 'assets/ui/images/img_settings.png',
      sizeX: 400,
      sizeY: 100,
      posX: 100,
      posY: 100,
      frames: 1
    }],

    text: [
    {

    }]
  };
};
