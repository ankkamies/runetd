'use strict';

var Phaser = require('phaser');
var EasyStar = require('easystarjs');

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
    path: { x: [], y: [] },
    lives: 10,
    currency: 400,
    cursor: {},
    buildMode: false,
    enemies: {},
    towers: {},
    projectiles: {},
    px: 0,
    py: 0,

    init: function() {
      // Initialize variables
      this.images = [];
      this.layers = [];
      this.path.x = [];
      this.path.y = [];
      this.lives = 100;
      this.wave.index = 0;
      this.wave.number = 0;
      this.wave.spawned = false;
      this.wave.finished = false;
      this.currency = 400;
      this.buildMode = false;
    },

    preload: function() {
      this.data = require('../data/game.js')(this);

      // Load waves from data
      this.waves = this.data.waves;

      // Preload tile data
      this.load.tilemap('map', 'assets/game/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.image('test', 'assets/game/tiles/test.png');

      // Test graphics
      this.load.image('enemy', 'assets/game/enemies/enemy.png');
      this.load.image('tower', 'assets/game/towers/tower.png');
      this.load.image('projectile', 'assets/game/projectiles/projectile.png');

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

      // Start physics engine
      this.physics.startSystem(Phaser.Physics.ARCADE);

      // Add tilemap
      this.map = this.add.tilemap('map');
      this.map.addTilesetImage('test');

      // Create background layer
      this.layers.background = this.map.createLayer('Background');
      this.layers.background.resizeWorld();

      // Get path from object layer
      this.calculateRoute();

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

      this.updateEnemies();

      this.updateTowers();

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
        // If there are waves left, start next one, else end game
        if (this.wave.index < this.waves.length) {
          this.waveTimer.add(this.waves[this.wave.index].delay, this.startNextWave, this);          
        } else {
          console.log('You won!');
          this.state.start('stages');
        }
      }

    },

    updateEnemies: function() {
      this.enemies.forEach(function(enemy) {
        if (enemy.alive) {
          enemy.move();
        }
      },this);
    },

    updateTowers: function() {
      // Scan for enemies and shoot at them
      this.towers.forEach(function(tower) {
        // Check if current target is out of range or dead
        if (tower.target) {
          if (this.math.distance(tower.x, tower.y, tower.target.x, tower.target.y) > tower.range || !tower.target.alive) {
            tower.target = null;
          }
        } else {
          // Scan for a new target
          for (var i = 0;i < this.enemies.children.length; i++) {
            // Search for enemies in range and set target to first alive one found
            if (this.math.distance(tower.x, tower.y, this.enemies.children[i].x, this.enemies.children[i].y) < tower.range) {
              if (this.enemies.children[i].alive) {
                tower.target = this.enemies.children[i];
                break;
              } else {
                // No target found
                tower.target = null;
              }
            }
          }
        }

        // Shoot at target
        tower.shoot();
      }, this);
    },

    updateCursor: function() {
      // Get tile from game area
      this.cursor.tile = this.map.getTile(this.layers.background.getTileX(this.input.activePointer.worldX),
                                          this.layers.background.getTileY(this.input.activePointer.worldY));

      // Update cursor position if tile was found
      if (this.cursor.tile !== null) {
        // Set tile x and y to cursor
        this.cursor.x = this.cursor.tile.x * 32;
        this.cursor.y = this.cursor.tile.y * 32;
        if (this.buildMode) {
          this.cursor.visible = true;
          // Tint the cursor green or red
          if (this.cursor.tile.properties.buildable) {
            this.cursor.tint = 0x00FF00;
          } else {
            this.cursor.tint = 0xFF0000;
          }
        } 
      } else {
        // Hide cursor when not over game area
        this.cursor.visible = false;
      }
    },

    calculateRoute: function() {

      var easystar = new EasyStar.js();

      var points = this.updateGrid();

      easystar.setGrid(this.grid);
      easystar.setAcceptableTiles([0]);
      easystar.enableDiagonals();
      easystar.disableCornerCutting();

      easystar.findPath(points[0][0], points[0][1], points[1][0], points[1][1], function( path ) {
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

      easystar.calculate();
    },

    updateGrid: function(){
      var map = this.map.layers[0].data;
      var grid = [];
      var start = [];
      var end = [];

      // Convert map
      for (var i = 0;i < map.length;i++) {
        grid[i] = [];
        for (var j = 0;j < map[i].length;j++) {
          if (map[i][j].properties.buildable) {
            grid[i].push(1);            
          } else {
            if (map[i][j].properties.start) {
              start = [j,i];
            } else if (map[i][j].properties.end) {
              end = [j,i];
            }
            grid[i].push(0);
          }
        }
      }

      this.grid = grid;

      return [start, end];
    },

    onEnemyHit: function(projectile, enemy) {
      enemy.health -= projectile.damage;
      enemy.speed *= 0.9;

      projectile.kill();

      // Remove dead enemies
      if (enemy.health <= 0) {
        this.tweens.removeFrom(enemy);
        enemy.destroy();
        this.currency += 20;
      }
    },

    startNextWave: function() {
      this.wave.number += 1;
      this.createWave();
    },

    createWave: function() {
      this.createEnemies();

      // Timer has autodestroy set to true so it must be created for each wave
      this.spawnTimer = this.time.create(true);

      // Add timer events for spawning enemies
      this.spawnTimer.repeat(this.waves[this.wave.index].spawnDelay, this.enemies.length, this.spawnEnemy, this);
      this.spawnTimer.start();
      this.spawnTimer.onComplete.add(function() {
        this.wave.spawned = true;
      }, this);
    },

    createEnemies: function() {
      // Create all enemies in the enemies group
      this.enemies.createMultiple(this.waves[this.wave.index].count, 'enemy');

      // Loop through enemies to set attributes on each one
      this.enemies.forEach(function(enemy) {
        // Set properties
        enemy.anchor.set(0.5, 0.5);
        // NEW WAY
        enemy.speed = this.waves[this.wave.index].speed;
        enemy.maxHealth = this.waves[this.wave.index].health;
        enemy.path = this.path.slice();

        // Set start node to first node of path and then remove it so path[0] points to next node
        enemy.startNode = { x: enemy.path[0].x, y: enemy.path[0].y };
        enemy.x = enemy.startNode.x;
        enemy.y = enemy.startNode.y;

        enemy.path.shift();

        // Calculate distance and direction to next node
        enemy.distanceToNextNode = this.physics.arcade.distanceToXY(enemy, enemy.path[0].x, enemy.path[0].y);
        enemy.directionToNextNode = { x: (enemy.path[0].x - enemy.x) / enemy.distanceToNextNode,
                                      y: (enemy.path[0].y - enemy.y) / enemy.distanceToNextNode };

        enemy.reduceLives = function() {
          this.lives -= 1;
        }.bind(this);

        enemy.move = function() {
          var deltatime = this.game.time.now - this.lastMoved;
          this.x += this.directionToNextNode.x * this.speed * deltatime/1000;
          this.y += this.directionToNextNode.y * this.speed * deltatime/1000;
          this.lastMoved = this.game.time.now;
          if (this.game.physics.arcade.distanceToXY(this, this.startNode.x, this.startNode.y) >= this.distanceToNextNode) {
            this.x = this.path[0].x;
            this.y = this.path[0].y;
            this.startNode = { x: this.path[0].x, y: this.path[0].y };
            this.path.shift();
            if (this.path.length === 0) {
              this.reduceLives();
              this.destroy();
              return;
            }
            this.distanceToNextNode = this.game.physics.arcade.distanceToXY(this, this.path[0].x, this.path[0].y);
            this.directionToNextNode = { x: (this.path[0].x - this.x) / this.distanceToNextNode,
                                          y: (this.path[0].y - this.y) / this.distanceToNextNode };
          }
        };
      }, this);

    },

    spawnEnemy: function() {
      // Find first "dead" enemy and revive it at start position
      // Enemies are destroyed(removed from group) so actual dead enemies will not be revived
      var enemy = this.enemies.getFirstDead();
      enemy.reset(enemy.startNode.x, enemy.startNode.y, enemy.maxHealth);
      enemy.lastMoved = this.time.now;
    },

    createTower: function() {
      // Check if trying to build on a tile
      if (this.cursor.tile && this.buildMode) {
        // Build a tower if possible
        if (this.cursor.tile.properties.buildable && this.currency >= 50) {
          var tower = this.add.sprite(this.cursor.x, this.cursor.y, 'tower');

          // Reduce currency
          this.currency -= 50;

          // Set tower properties
          tower.range = 200;
          tower.nextFire = 0;
          tower.fireRate = 1000;

          tower.target = null;

          // Circle for displaying towers range
          tower.rangeCircle = this.add.graphics();
          tower.rangeCircle.lineStyle(2, 0x000000, 1);
          tower.rangeCircle.drawCircle(this.cursor.x + 16, this.cursor.y + 16, tower.range * 2);
          tower.rangeCircle.visible = false;

          // Add mouseover events for displaying rangeCircle
          tower.inputEnabled = true;
          tower.events.onInputOver.add(function() {this.rangeCircle.visible = true;}, tower);
          tower.events.onInputOut.add(function() {this.rangeCircle.visible = false;}, tower);

          // Create a subgroup for projectiles of this tower
          tower.projectiles = this.add.group();
          tower.projectiles.enableBody = true;
          tower.projectiles.physicsBodyType = Phaser.Physics.ARCADE;

          // Create 50 projectiles that will be revived when shooting
          tower.projectiles.createMultiple(50, 'projectile');
          tower.projectiles.setAll('checkWorldBounds', true);
          tower.projectiles.setAll('outOfBoundsKill', true);
          tower.projectiles.setAll('damage', 20);

          // Add reference to game object
          tower.game = this;

          // Add projectiles to main projectile group for collision checking
          this.projectiles.add(tower.projectiles);

          tower.shoot = function() {
            if (this.target && this.game.time.now > this.nextFire) {
              // Calculate next time to shoot
              this.nextFire = this.game.time.now + this.fireRate;

              var projectile = this.projectiles.getFirstDead();
              projectile.reset(this.x + 16, this.y + 16);
              this.game.physics.arcade.moveToObject(projectile, this.target, 800);
            }
          };

          // Give the tile a reference to the tower and add it to towers group
          this.cursor.tile.properties.tower = tower;
          this.towers.add(tower);
        }
      }
    }

  };
};
