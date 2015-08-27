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
    buildPhase: false,
    enemies: {},
    towers: {},
    projectiles: {},
    route: {},
    px: 0,
    py: 0,
    pathfinder: {},
    selectedTower: 0,
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

      // Preload UI
      this.ui = new UI(this);

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

      // Create waveTimer
      this.waveTimer = this.time.create(false);

      // Create groups for enemies, towers and projectiles
      // Order is important, since it affects draw order
      this.towers = this.add.group();
      this.projectiles = this.add.group();
      this.enemies = this.add.group();
      this.enemies.enableBody = true;
      this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

      // Create UI elements
      this.ui.create();

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

      this.ui.update();

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

    createCallback: function(entity) {
      return function() {
        this.setStatusText(entity);
      };
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

        enemy.inputEnabled = true;
        enemy.events.onInputOver.add(this.createCallback(enemy), this.ui);
        enemy.events.onInputOut.add(this.ui.clearStatusText, this.ui);

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
      if (this.ui.cursor.tile && this.buildPhase && this.selectedTower !== null) {
        // Build a tower if possible
        if (this.ui.cursor.tile.properties.buildable && this.currency >= this.selectedTower.cost && 
            !this.ui.cursor.tile.hasEnemies && !this.ui.cursor.tile.tower) {
          if (this.isPathBlocked(this.ui.cursor.tile.x, this.ui.cursor.tile.y)) {
            return;
          }
          var tower = new Tower(this, this.ui.cursor.x, this.ui.cursor.y, this.selectedTower.type);
          tower.anchor.setTo(0.5, 0.5);

          // Add sprite to game
          this.add.existing(tower);

          // Reduce currency
          this.currency -= tower.value;

          // Add projectiles to main projectile group for collision checking
          this.projectiles.add(tower.projectiles);

          // Give the tile a reference to the tower
          this.ui.cursor.tile.tower = tower;

          tower.inputEnabled = true;
          tower.events.onInputOver.add(this.createCallback(tower), this.ui);
          tower.events.onInputOut.add(this.ui.clearStatusText, this.ui);

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
