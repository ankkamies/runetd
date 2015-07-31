'use strict';

module.exports = function(game) {
  return {
    buttons: [
    { 
      id: 'btn_buy',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      sizeX: 100,
      sizeY: 50,
      posX: 350,
      posY: 300,
      actionOnClick: function() {
        console.log('TODO: Charge credit card');
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
      id: 'img_shop',
      spritesheet: 'assets/ui/images/img_shop.png',
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
