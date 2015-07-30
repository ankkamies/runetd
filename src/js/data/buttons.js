'use strict';

module.exports = [
  { 
    id: 'btn_start',
    spritesheet: 'assets/menu/btn_placeholder.png',
    sizeX: 100,
    sizeY: 50,
    posX: 100,
    posY: 100,
    actionOnClick: function() {
      console.log('start');
    }
  },
  { 
    id: 'btn_cancel',
    spritesheet: 'assets/menu/btn_placeholder.png',
    sizeX: 100,
    sizeY: 50,
    posX: 100,
    posY: 200,
    actionOnClick: function() {
      console.log('cancel');
    }
  }
];
