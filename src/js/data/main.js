'use strict';

module.exports = function(game) {
  return {
    buttons: [
    { 
      id: 'btn_play',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      size: { 
        x: 100, 
        y: 50 
      },
      pos: { 
        x: 520, 
        y: 250 
      },
      actionOnClick: function() {
        game.state.start('stages');
      }
    },
    { 
     id: 'btn_shop',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      size: { 
        x: 100, 
        y: 50 
      },
      pos: { 
        x: 520, 
        y: 350 
      },
      actionOnClick: function() {
        game.state.start('shop');
      }
    },
    { 
     id: 'btn_settings',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      size: { 
        x: 100, 
        y: 50 
      },
      pos: { 
        x: 520, 
        y: 450 
      },
      actionOnClick: function() {
        game.state.start('settings');
      }
    },
    {
      id: 'btn_intro',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      size: { 
        x: 100, 
        y: 50 
      },
      pos: { 
        x: 0, 
        y: 590 
      },
      actionOnClick: function() {
        game.state.start('intro');
      }
    }],

    images: [
    {
      id: 'img_logo',
      spritesheet: 'assets/ui/images/img_logo.png',
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
