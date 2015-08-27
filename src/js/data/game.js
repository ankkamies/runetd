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
        if (game.buildPhase) {
          if (game.selectedTower === this.tower) {
            game.selectedTower = null;
          } else {
            game.selectedTower = this.tower;
          }
        }
      }
    },

    waves: [
    {
      count: 10,
      maxHealth: 120,
      speed: 100,
      value: 2,
      delay: 40000,
      spawnDelay: 1000
    },
    {
      count: 15,
      maxHealth: 150,
      speed: 100,
      value: 3,
      delay: 40000,
      spawnDelay: 400
    },
    {
      count: 20,
      maxHealth: 180,
      speed: 150,
      value: 3,
      delay: 40000,
      spawnDelay: 350
    },
    {
      count: 20,
      maxHealth: 200,
      speed: 200,
      value: 3,
      delay: 40000,
      spawnDelay: 350
    },
    {
      count: 20,
      maxHealth: 250,
      speed: 100,
      value: 3,
      delay: 40000,
      spawnDelay: 400
    },
    {
      count: 25,
      maxHealth: 250,
      speed: 300,
      value: 2,
      delay: 40000,
      spawnDelay: 800
    },
    {
      count: 30,
      maxHealth: 300,
      speed: 250,
      value: 2,
      delay: 40000,
      spawnDelay: 500
    },
    {
      count: 5,
      maxHealth: 1000,
      speed: 150,
      value: 20,
      delay: 40000,
      spawnDelay: 1500
    },
    {
      count: 1,
      maxHealth: 10000,
      speed: 100,
      value: 100,
      delay: 40000,
      spawnDelay: 100
    }]
  };
};
