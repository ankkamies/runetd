'use strict';

module.exports = function(game) {
  return {
    buttons: [
    { 
      id: 'btn_return',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      size: { 
        x: 100, 
        y: 50 
      },
      pos: { 
        x: 1040, 
        y: 590 
      },
      actionOnClick: function() {
        game.state.start('main');
      }
    }],

    stageButton: {
      id: 'btn_stageselect',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      size: {
        x: 100,
        y: 50
      }
    },

    images: [
    {
      id: 'img_stages',
      spritesheet: 'assets/ui/images/img_stages.png',
      size: {
        x: 400, 
        y: 100 
      },
      pos: { 
        x: 370, 
        y: 100 
      },
      frames: 1
    }],

    text: [
    {

    }]
  };
};
