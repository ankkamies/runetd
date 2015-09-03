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
        y: 590 
      },
      actionOnClick: function() {
        game.state.start('stages');
      }
    },
    {
      id: 'btn_startnextwave',
      spritesheet: 'assets/ui/buttons/btn_placeholder.png',
      frames: [0, 1, 2, 3],
      size: {
        x: 100,
        y: 50
      },
      pos: {
        x: 970,
        y: 30
      },
      actionOnClick: function() {
        // Button works only when timer is running
        if (game.waveTimer.running) {
          // Remove event from waveTimer and start wave manually
          game.waveTimer.stop(true);
          game.startNextWave();
        }
      }
    }],

    images: [{
      id: 'img_invslot',
      spritesheet: 'assets/ui/images/img_invslot.png',
      size: {
        x: 40,
        y: 40
      },
      pos: {
        x: null,
        y: null
      },
      frames: 1
    }],

    text: [
    {

    }],

    towerFrame: {
      id: 'img_towerframe',
      spritesheet: 'assets/ui/images/img_towerframe.png',
      frames: [null, null],
      size: { 
        x: 50, 
        y: 50 
      },
      pos: { 
        x: 970,
        y: 100 
      },
      actionOnClick: function() {
        if (game.buildPhase && game.currency >= this.tower.cost) {
          if (game.buildTower === this.tower) {
            game.buildTower = null;
          } else {
            game.buildTower = this.tower;
          }
        }
      }
    },
  };
};
