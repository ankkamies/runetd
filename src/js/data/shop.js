'use strict';

module.exports = function(game) {
  return {
    buttons: [
    { 
      id: 'btn_buy',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      size: { 
        x: 100, 
        y: 50 
      },
      pos: { 
        x: 520, 
        y: 300 
      },
      actionOnClick: function() {
        console.log('TODO: Charge credit card');
      }
    },
    { 
     id: 'btn_return',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      size: { 
        x: 100, 
        y: 50 
      },
      pos: { 
        x: 1040, 
        y: 670 
      },
      actionOnClick: function() {
        game.state.start('main');
      }
    }],

    images: [
    {
      id: 'img_shop',
      spritesheet: 'assets/ui/images/img_shop.png',
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
