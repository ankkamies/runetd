'use strict';

var Phaser = require('phaser');

module.exports = function () {
  return {
    data: {},
    map: {},
    buttons: {},
    images: [],
    layers: [],
    wave: 0,
    path: {x: [], y: []},
    lives: 10,
    cursor: {},
    buildMode: false,

    init: function() {
      // Initialize variables
      this.images = [];
      this.layers = [];
      this.path.x = [];
      this.path.y = [];
      this.lives = 10;
    },

    preload: function() {
      // Require data
      this.data = require('../data/game.js')(this);

      // Preload tile data
      this.load.tilemap('map', 'assets/game/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.image('test', 'assets/game/tiles/test.png');

      // Test graphics
      this.load.image('enemy', 'assets/game/enemies/enemy.png');
      this.load.image('tower', 'assets/game/towers/tower.png');

      // Preload button sprites from data
      for (var i = 0; i < this.data.buttons.length; i++) {
        this.load.spritesheet(this.data.buttons[i].id, 
                              this.data.buttons[i].spritesheet, 
                              this.data.buttons[i].size.x, 
                              this.data.buttons[i].size.y,
                              this.data.buttons[i].frames.length);
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

      // Create background layer
      this.layers[0] = this.map.createLayer('Background');
      this.layers[0].resizeWorld();

      // Get path from object layer
      this.calculateRoute();

      // Create buttons from data
      for (var i = 0; i < this.data.buttons.length; i++) {
        this.buttons[this.data.buttons[i].id] = this.add.button(this.data.buttons[i].pos.x, 
                                                                this.data.buttons[i].pos.y, 
                                                                this.data.buttons[i].id, 
                                                                this.data.buttons[i].actionOnClick, null,
                                                                this.data.buttons[i].frames[0],
                                                                this.data.buttons[i].frames[1],
                                                                this.data.buttons[i].frames[2],
                                                                this.data.buttons[i].frames[3]);
      }

      // Create images from data
      for (i = 0; i < this.data.images.length; i++) {
        this.images[this.data.images[i].id] = this.add.sprite(this.data.images[i].pos.x, 
                                                              this.data.images[i].pos.y, 
                                                              this.data.images[i].id);
      }

      // Create cursor rectangle
      this.cursor = this.add.graphics();
      this.cursor.lineStyle(2, 0x000000, 1);
      this.cursor.beginFill(0xB0B0B0, 0.5);
      this.cursor.drawRect(0, 0, 32, 32);
      this.cursor.endFill();

      // Start first wave
      this.createNextWave();

      // Add input event to create tower when clicking
      this.input.onDown.add(function(pointer, event) { 
        this.createTower(); 
      }, this);
    },

    update: function() {
      this.game.debug.text("Lives: " + this.lives, 50, 50);

      // Only show cursor when build mode is active
      if (this.buildMode) {
        // Get tile from game area
        this.cursor.tile = this.map.getTile(this.layers[0].getTileX(this.input.activePointer.worldX),
                                            this.layers[0].getTileY(this.input.activePointer.worldY));

        // Update cursor position if tile was found
        if (this.cursor.tile !== null) {
          this.cursor.visible = true;
          this.cursor.x = this.layers[0].getTileX(this.input.activePointer.worldX) * 32;
          this.cursor.y = this.layers[0].getTileY(this.input.activePointer.worldY) * 32;
          // Tint the cursor green or red
          if (this.cursor.tile.properties.buildable) {
            this.cursor.tint = 0x00FF00;
          } else {
            this.cursor.tint = 0xFF0000;
          }       
        } else {
          // Hide cursor when not over game area
          this.cursor.visible = false;
        }
      } else {
        this.cursor.visible = false;
      }

      // If lives reach zero, game over
      if (this.lives === 0) {
        this.state.start('stages');
      }

    },

    calculateRoute: function() {
      // Get path from map
      var pathArray = this.map.objects.Path[0].polyline;

      // Fix coordinates and convert path to an array that tweens support
      for (var i = 0;i < pathArray.length; i++) {
        this.path.x.push(pathArray[i][0] + this.map.objects.Path[0].x); 
        this.path.y.push(pathArray[i][1] + this.map.objects.Path[0].y); 
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


      // Add rest of the tweens and chain them (if any)
      for (var i = 2; i < this.path.x.length; i++) {
        duration = 5 * this.math.distance(this.path.x[i-1], this.path.y[i-1], this.path.x[i], this.path.y[i]);
        twns.push(this.add.tween(enemy).to({ x: this.path.x[i], y: this.path.y[i] }, duration, Phaser.Easing.Linear.None));
        twns[twns.length - 2].chain(twns[twns.length - 1]);
      }

      // If last tween finishes, destroy enemy sprite and reduce lives
      twns[twns.length - 1].onComplete.add(function() { 
        enemy.destroy(); 
        this.lives -= 1; 
      }, this);

    },

    createTower: function() {
      // Check if trying to build on a tile
      if (this.cursor.tile) {
        // Build a tower if possible
        if (this.cursor.tile.properties.buildable) {
          var tower = this.add.sprite(this.cursor.x, this.cursor.y, 'tower');
          this.cursor.tile.properties.buildable = false;
        }
      }
    }

  };
};
