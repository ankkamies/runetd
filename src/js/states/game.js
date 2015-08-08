'use strict';

var Phaser = require('phaser');

module.exports = function () {
  return {
    data: {},
    map: {},
    buttons: [],
    images: [],
    layers: [],
    wave: 0,
    path: {x: [], y: []},
    lives: 10,

    init: function() {
      this.images = [];
      this.layers = [];
      this.path.x = [];
      this.path.y = [];
      this.lives = 10;
    },

    preload: function() {
      // Load data from file
      this.data = require('../data/game.js')(this);

      // Preload tile data
      this.load.tilemap('map', 'assets/game/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.image('test', 'assets/game/tiles/test.png');
      this.load.image('enemy', 'assets/game/enemies/enemy.png');

      // Preload button sprites from data
      for (var i = 0; i < this.data.buttons.length; i++) {
        this.load.spritesheet(this.data.buttons[i].id, 
                              this.data.buttons[i].spritesheet, 
                              this.data.buttons[i].size.x, 
                              this.data.buttons[i].size.y, 4);
      }

      // Preload image sprites from data
      for (i = 0; i < this.data.images.length; i++) {
        this.load.spritesheet(this.data.images[i].id, 
                              this.data.images[i].spritesheet, 
                              this.data.images[i].size.x, 
                              this.data.images[i].size.y,
                              this.data.images[i].frames);
      }
    },

    create: function() {
      // Set background color
      this.stage.backgroundColor = '#181818';

      // Add tilemap
      this.map = this.add.tilemap('map');
      this.map.addTilesetImage('test');

      this.layers[0] = this.map.createLayer('Background');
      this.layers[0].resizeWorld();

      // Get path from object layer
      this.calculateRoute(this.map.objects.Path[0].polyline,
                          this.map.objects.Path[0].x,
                          this.map.objects.Path[0].y);

      // Create buttons from data
      for (var i = 0; i < this.data.buttons.length; i++) {
        this.buttons[this.data.buttons[i].id] = this.add.button(this.data.buttons[i].pos.x, 
                                                                this.data.buttons[i].pos.y, 
                                                                this.data.buttons[i].id, 
                                                                this.data.buttons[i].actionOnClick, 
                                                                this, 0, 1, 2, 3);
      }

      // Create images from data
      for (i = 0; i < this.data.images.length; i++) {
        this.images[this.data.images[i].id] = this.add.sprite(this.data.images[i].pos.x, 
                                                              this.data.images[i].pos.y, 
                                                              this.data.images[i].id);
      }

      // Start first wave
      this.createNextWave();
    },

    update: function() {
      this.game.debug.text("Lives: " + this.lives, 50, 50);

      if (this.lives === 0) {
        this.state.start('stages');
      }
    },

    calculateRoute: function(pathArray, pathPosX, pathPosY) {
      // Fix coordinates and convert path to an array that tweens support
      for (var i = 0;i < pathArray.length; i++) {
        this.path.x.push(pathArray[i][0] + pathPosX); 
        this.path.y.push(pathArray[i][1] + pathPosY); 
      }
    },

    createNextWave: function() {
      this.time.events.repeat(2000, 10, this.createEnemy, this);
      this.wave += 1;
    },

    createEnemy: function() {
      // Add enemy to spawn point
      var enemy = this.add.sprite(this.path.x[0], this.path.y[0], 'enemy');
      enemy.anchor.set(0.5, 0.5);

      var twns = [];

      // Calculate duration between spawn point and first turning point
      var duration = 5 * this.math.distance(this.path.x[0], this.path.y[0], this.path.x[1], this.path.y[1]);

      // Add first tween
      twns.push(this.add.tween(enemy).to({ x: this.path.x[1], y: this.path.y[1] }, duration, Phaser.Easing.Linear.None, true));


      // Add rest of the tweens (if any)
      for (var i = 2; i < this.path.x.length; i++) {
        duration = 5 * this.math.distance(this.path.x[i-1], this.path.y[i-1], this.path.x[i], this.path.y[i]);
        twns.push(this.add.tween(enemy).to({ x: this.path.x[i], y: this.path.y[i] }, duration, Phaser.Easing.Linear.None));
        twns[twns.length - 2].chain(twns[twns.length - 1]);
      }

      // If last tween finishes, destroy enemy and reduce lives
      twns[twns.length - 1].onComplete.add(function() { 
        enemy.destroy(); 
        this.lives -= 1; 
      }, this);

    }
  };
};
