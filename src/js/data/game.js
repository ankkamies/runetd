'use strict';

module.exports = function(game) {
  return {
    buttons: [
    { 
      id: 'btn_return',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      // Over, out, down, up
      frames: [0, 1, 2, 3],
      size: { 
        x: 100, 
        y: 50 
      },
      pos: { 
        x: 1040, 
        y: 670 
      },
      actionOnClick: function() {
        game.state.start('stages');
      }
    },
    { 
      id: 'btn_buildmode',
      spritesheet: 'assets/ui/buttons/btn_buildmode.png',
      frames: [null, null],
      size: { 
        x: 100, 
        y: 50 
      },
      pos: { 
        x: 1040, 
        y: 200 
      },
      actionOnClick: function() {
        game.buildMode = !game.buildMode;
        // Change build mode button frame to match build state
        if (game.buildMode) {
          this.frame = 1;
        } else {
          this.frame = 0;
        }
      }
    }],

    images: [],

    text: [
    {

    }]
  };
};
