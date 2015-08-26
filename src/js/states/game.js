'use strict';

var Phaser = require('phaser');
var EasyStar = require('easystarjs');

var Tower = require('../game/tower.js');
var Enemy = require('../game/enemy.js');
var Projectile = require('../game/projectile.js');
var UI = require('../game/ui.js');

module.exports = function () {
  return {
    data: {},
    map: {},
    buttons: {},
    images: {},
    layers: {},
    waveTimer: {},
    waves: [],
    wave: {},
    path: [],
    grid: [],
    lives: 10,
    currency: 300,
    cursor: {},
    buildMode: false,
    enemies: {},
    towers: {},
    projectiles: {},
    route: {},
    px: 0,
    py: 0,
    pathfinder: {},
    selectedTower: 0,
    buildButtons: [],
    towerImages: [],
    ui: {},

    init: function() {
      // Initialize variables
      this.images = [];
      this.layers = [];
      this.path = [];
      this.lives = 100;
      this.wave.data = {};
      this.wave.index = 0;
      this.wave.number = 0;
      this.wave.spawned = false;
      this.wave.finished = false;
      this.currency = 300;
      this.buildPhase = true;
      this.selectedTower = null;
      this.ui = {};
    },

    preload: function() {
      this.data = require('../data/game.js')(this);

      // Set advanced timing on
      this.time.advancedTiming = true;

      // Load waves from data
      this.waves = this.data.waves;

      // Preload tile data
      this.load.tilemap('map', 'assets/game/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.image('test', 'assets/game/tiles/test.png');

      // Preload Tower data
      for (var i = 0; i < Tower.DATA.length; i++) {
        this.load.image(Tower.DATA[i].id, Tower.DATA[i].spritesheet);
      }

      // Preload Enemy data
      for (i = 0; i < Enemy.DATA.length; i++) {
        this.load.image(Enemy.DATA[i].id, Enemy.DATA[i].spritesheet);
      }

      // Preload Projectile data
      for (i = 0; i < Projectile.DATA.length; i++) {
        this.load.image(Projectile.DATA[i].id, Projectile.DATA[i].spritesheet);
      }

      // Preload button sprites from data
      for (i = 0; i < this.data.buttons.length; i++) {
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

      // Preload tower frame
      this.load.spritesheet(this.data.towerFrame.id, 
                            this.data.towerFrame.spritesheet,
                            this.data.towerFrame.size.x,
                            this.data.towerFrame.size.y,
                            this.data.towerFrame.frames.length);
    },

    create: function() {
      // Set background color
      this.stage.backgroundColor = '#181818';

      // Start physics engine
      this.physics.startSystem(Phaser.Physics.ARCADE);

      // Add tilemap
      this.map = this.add.tilemap('map');
      this.map.addTilesetImage('test');

      // Create background layer
      this.layers.background = this.map.createLayer('Background');
      this.layers.background.resizeWorld();

      // Set up pathfinder
      this.pathfinder = new EasyStar.js();
      this.updateGrid();
      this.pathfinder.setAcceptableTiles([0]);
      this.pathfinder.enableDiagonals();
      this.pathfinder.disableCornerCutting();
      this.pathfinder.enableSync();

      // Get path from object layer
      this.calculatePath();

      // Create UI
      this.ui = new UI(this);

      // Create waveTimer
      this.waveTimer = this.time.create(false);

      // Create groups for enemies, towers and projectiles
      this.enemies = this.add.group();
      this.enemies.enableBody = true;
      this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

      this.towers = this.add.group();
      this.projectiles = this.add.group();

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

      // Create tower buttons from tower data
      for (i = 0; i < Tower.DATA.length; i++) {
        this.buildButtons[i] = this.add.button(this.data.towerFrame.pos.x + 55 * i,
                                               this.data.towerFrame.pos.y,
                                               this.data.towerFrame.id,
                                               this.data.towerFrame.actionOnClick, null);

        this.buildButtons[i].tower = Tower.DATA[i];

        this.towerImages[i] = this.add.sprite(this.data.towerFrame.pos.x + 55 * i + 9,
                                              this.data.towerFrame.pos.y + 9,
                                              Tower.DATA[i].id);
      }

      // Create cursor rectangle
      this.cursor = this.add.graphics();
      this.cursor.lineStyle(2, 0x000000, 1);
      this.cursor.beginFill(0xB0B0B0, 0.5);
      this.cursor.drawRect(0, 0, 32, 32);
      this.cursor.endFill();
      this.cursor.visible = false;

      // Add first wave
      this.waveTimer.add(this.waves[this.wave.index].delay, this.startNextWave, this);
      this.waveTimer.start();

      // Add input event to create tower when clicking
      this.input.onDown.add(function(pointer, event) { 
        this.createTower(); 
      }, this);
    },

    update: function() {
      this.game.debug.text("Fps: " + this.time.fps || '--', 1000, 20);
      this.game.debug.text("Money: " + this.currency, 20, 30);
      this.game.debug.text("Lives: " + this.lives, 20, 50);
      this.game.debug.text("Enemies: " + this.enemies.countLiving(), 20, 70);
      this.game.debug.text("Wave: " + this.wave.number + "/" + this.waves.length, 20, 90);
      this.game.debug.text("Next wave in: " + this.waveTimer.duration, 20, 110);
      if (this.spawnTimer) {
        this.game.debug.text("Next spawn in: " + this.spawnTimer.duration, 20, 130);       
      }

      // Update the build cursor
      this.updateCursor();

      this.updateUI();

      // Collision check
      this.physics.arcade.overlap(this.projectiles, this.enemies, this.onEnemyHit, null, this);

      // If lives reach zero, game over
      if (this.lives === 0) {
        console.log('You lost!');
        this.state.start('stages');
      }

      // Check if wave is complete
      if (this.wave.spawned && this.enemies.countLiving() === 0) {
        this.wave.spawned = false;
        this.wave.index += 1;
        this.currency += this.wave.data.value * this.wave.data.count;
        this.buildPhase = true;
        // If there are waves left, start next one, else end game
        if (this.wave.index < this.waves.length) {
          this.waveTimer.add(this.waves[this.wave.index].delay, this.startNextWave, this);
          this.waveTimer.start();
        } else {
          console.log('You won!');
          this.state.start('stages');
        }
      }

    },

    updateUI: function() {
      for (var i = 0; i < this.buildButtons.length; i++) {
        if (this.buildButtons[i].tower === this.selectedTower) {
          this.buildButtons[i].frame = 1;
        } else {
          this.buildButtons[i].frame = 0;
        }
      }

      this.ui.update();
    },

    updateCursor: function() {
      // get tile from game area
      this.cursor.tile =
      this.map.getTile(this.layers.background.getTileX(this.input.activePointer.worldX),
                                          this.layers.background.getTileY(this.input.activePointer.worldY));

      // update cursor position if tile was found
      if (this.cursor.tile !== null) {
        // set tile x and y to cursor
        this.cursor.x = this.cursor.tile.x * 32;
        this.cursor.y = this.cursor.tile.y * 32;

        if (this.buildPhase && this.selectedTower !== null) {
          this.cursor.visible = true;
          // tint the cursor green or red
          if (this.cursor.tile.properties.buildable && !this.cursor.tile.hasEnemies && !this.cursor.tile.tower) {
            this.cursor.tint = 0x00ff00;
          } else {
            this.cursor.tint = 0xff0000;
          }
          if (this.cursor.tile.properties.blocksPath) {
            this.cursor.tint = 0xff0000;
          } else if (this.cursor.tile !== this.cursor.lastTile) {
            if (this.isPathBlocked(this.cursor.tile.x, this.cursor.tile.y)) {
              this.cursor.tint = 0xff0000;
              this.cursor.tile.properties.blocksPath = true;
            }
          }
          this.cursor.lastTile = this.cursor.tile;
        } else {
          // hide cursor if not building
          this.cursor.visible = false;
        }
      } else {
        // hide cursor when not over game area
        this.cursor.visible = false;
      }
    },

    calculatePath: function() {
      this.updateGrid();

      this.pathfinder.findPath(this.route.start.x, this.route.start.y, 
                               this.route.end.x, this.route.end.y, function( path ) {
        if (path === null) {
          console.log("Path was not found.");
        }
        // Convert points to coordinates
        for (var i = 0; i < path.length; i++) {
          path[i].x = (path[i].x*32) + 16;
          path[i].y = (path[i].y*32) + 16;
        }
        this.path = path;
      }.bind(this));

      this.pathfinder.calculate();
    },

    updateGrid: function(){
      var map = this.map.layers[0].data;
      var grid = [];

      // Convert map
      for (var i = 0;i < map.length;i++) {
        grid[i] = [];
        for (var j = 0;j < map[i].length;j++) {
          if (map[i][j].tower) {
            grid[i].push(1);            
          } else {
            if (map[i][j].properties.start) {
              this.route.start = {x: j, y: i};
            } else if (map[i][j].properties.point) {
              // The order of turning points will be marked with numbers in the
              // map file so I can use that as an index to get correct order.
              this.route.points[map[i][j].properties.point] = {x: j, y: i};
            } else if (map[i][j].properties.end) {
              this.route.end = {x: j, y: i};
            } else if (map[i][j].properties.blocksPath) {
              // Used to determine if this tile blocks the path
              map[i][j].properties.blocksPath = false;
            }
            grid[i].push(0);
          }
        }
      }

      this.pathfinder.setGrid(grid);
    },

    onEnemyHit: function(projectile, enemy) {
      var damage = Math.floor((Math.random() * (projectile.damage[1] - projectile.damage[0])) + projectile.damage[0]);
      enemy.health -= damage;

      projectile.kill();

      // Remove dead enemies
      if (enemy.health <= 0) {
        this.tweens.removeFrom(enemy);
        if (enemy.destinationTile) {
          enemy.destinationTile.hasEnemies = false;          
        }
        enemy.destroy();
        this.currency += this.wave.data.value;
      }
    },

    startNextWave: function() {
      this.wave.number += 1;
      this.buildPhase = false;
      this.selectedTower = null;

      // Update grid and calculate path
      this.updateGrid();
      this.calculatePath();

      this.createWave();
    },

    createWave: function() {
      this.wave.data = this.waves[this.wave.index];
      this.createEnemies();

      // Timer has autodestroy set to true so it must be created for each wave
      this.spawnTimer = this.time.create(true);
      
      // Add timer events for spawning enemies
      this.spawnTimer.repeat(this.wave.data.spawnDelay, this.enemies.length, this.spawnEnemy, this);
      this.spawnTimer.start();
      this.spawnTimer.onComplete.add(function() {
        this.wave.spawned = true;
      }, this);
    },

    createEnemies: function() {
      for (var i = 0; i < this.wave.data.count; i++) {
        // Set properties
        var enemy = new Enemy(this, this.path[0].x, this.path[0].y, 0);
        enemy.anchor.set(0.5, 0.5);

        // Add created enemy to game
        this.add.existing(enemy);

        // Add created enemy to group
        this.enemies.add(enemy);

      }

    },

    spawnEnemy: function() {
      // Find first "dead" enemy and revive it at start position
      var enemy = this.enemies.getFirstDead();
      // ????
      var hp = enemy.maxHealth;
      enemy.revive(hp);
      enemy.setPath(this.path);
      enemy.lastMoved = this.time.now;
    },

    createTower: function() {
      // Check if trying to build on a tile
      if (this.cursor.tile && this.buildPhase && this.selectedTower !== null) {
        // Build a tower if possible
        if (this.cursor.tile.properties.buildable && this.currency >= this.selectedTower.cost && !this.cursor.tile.hasEnemies && !this.cursor.tile.tower) {
          if (this.isPathBlocked(this.cursor.tile.x, this.cursor.tile.y)) {
            return;
          }
          var tower = new Tower(this, this.cursor.x, this.cursor.y, this.selectedTower.type);
          tower.anchor.setTo(0.5, 0.5);

          // Add sprite to game
          this.add.existing(tower);

          // Reduce currency
          this.currency -= tower.value;

          // Add projectiles to main projectile group for collision checking
          this.projectiles.add(tower.projectiles);

          // Give the tile a reference to the tower
          this.cursor.tile.tower = tower;

          // Add tower to towers group
          this.towers.add(tower);

          // Set selected tower to null
          this.selectedTower = null;

          this.updateGrid();
        }
      }
    },

    isPathBlocked: function(x, y) {
      var isBlocked = false;

      // Check if building a tower blocks the path
      this.pathfinder.avoidAdditionalPoint(x, y);
      this.pathfinder.findPath(this.route.start.x, this.route.start.y, 
                               this.route.end.x, this.route.end.y, function( path ) {
        if (path === null) {
          isBlocked = true;
        }
      }.bind(isBlocked));

      this.pathfinder.calculate();
      this.pathfinder.stopAvoidingAdditionalPoint(x, y);

      return isBlocked;
    }

  };
};
