'use strict';

var Phaser = require('phaser');

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

    init: function() {
      // Initialize variables
      this.images = [];
      this.layers = [];
      this.path.x = [];
      this.path.y = [];
      this.lives = 10;
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

      // Create groups for enemies and towers
      this.enemies = this.add.group();
      this.enemies.enableBody = true;
      this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

      this.towers = this.add.group();

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

      // Scan for enemies and shoot
      this.towers.forEach(function(tower) {
        // Check collisions
        this.physics.arcade.overlap(tower.projectiles, this.enemies, this.onEnemyHit, null, this);

        // Check if current target is out of range
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
                tower.target = null;
              }
            }
          }
        }

        // Shoot at target
        tower.shoot();
      }, this);

      // If lives reach zero, game over
      if (this.lives === 0) {
        console.log('You lost!');
        this.state.start('stages');
      }

      if (this.wave.spawned && this.enemies.countLiving() === 0) {
        this.wave.spawned = false;
        if (this.wave.index < this.waves.length) {
          this.waveTimer.add(this.waves[this.wave.index].delay, this.startNextWave, this);          
        }
      }

      // If last wave has finished spawning and there are no living enemies left, end game
      if (this.wave.index === this.waves.length && this.enemies.countLiving() === 0) {
        console.log('You won!');
        this.state.start('stages');
      }

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
      // Get path from map
      var pathArray = this.map.objects.Path[0].polyline;

      // Fix coordinates and convert path to an array that tweens support
      for (var i = 0;i < pathArray.length; i++) {
        this.path.x.push(pathArray[i][0] + this.map.objects.Path[0].x); 
        this.path.y.push(pathArray[i][1] + this.map.objects.Path[0].y); 
      }
    },

    onEnemyHit: function(projectile, enemy) {
      enemy.health -= projectile.damage;
      projectile.kill();
      if (enemy.health < 0) {
        this.tweens.removeFrom(enemy);
        enemy.destroy();
        this.currency += 20;
      }
    },

    startNextWave: function() {
      this.spawnTimer = this.time.create(true);

      this.wave.number += 1;
      this.wave.spawned = false;

      this.spawnTimer.repeat(this.waves[this.wave.index].spawnDelay, this.waves[this.wave.index].count, this.createEnemy, this);
      this.spawnTimer.start();

      // When wave is complete, start next wave after a delay
      this.spawnTimer.onComplete.add(function() {
        // Move to next wave
        this.wave.index += 1;
        this.wave.spawned = true;
      }, this);
    },

    createEnemy: function() {
      // Add enemy to spawn point
      var enemy = this.add.sprite(this.path.x[0], this.path.y[0], 'enemy');
      enemy.anchor.set(0.5, 0.5);

      enemy.health = this.waves[this.wave.index].health;

      var twns = [];

      // Calculate duration between spawn point and first turning point
      var duration = 1000 * (this.math.distance(this.path.x[0], 
                                                this.path.y[0], 
                                                this.path.x[1], 
                                                this.path.y[1]) / this.waves[this.wave.index].speed);

      // Add first tween
      twns.push(this.add.tween(enemy).to({ x: this.path.x[1], 
                                           y: this.path.y[1] }, 
                                           duration, 
                                           Phaser.Easing.Linear.None, true));


      // Add rest of the tweens and chain them (if any)
      for (var i = 2; i < this.path.x.length; i++) {
        duration = 1000 * (this.math.distance(this.path.x[i-1], 
                                              this.path.y[i-1], 
                                              this.path.x[i], 
                                              this.path.y[i]) / this.waves[this.wave.index].speed);

        twns.push(this.add.tween(enemy).to({ x: this.path.x[i], 
                                             y: this.path.y[i] }, 
                                             duration, Phaser.Easing.Linear.None));

        twns[twns.length - 2].chain(twns[twns.length - 1]);
      }

      // If last tween finishes, destroy enemy sprite and reduce lives
      twns[twns.length - 1].onComplete.add(function() { 
        enemy.destroy(); 
        this.lives -= 1; 
      }, this);

      // Add enemy to group
      this.enemies.add(enemy);

    },

    createTower: function() {
      // Check if trying to build on a tile
      if (this.cursor.tile && this.buildMode) {
        // Build a tower if possible
        if (this.cursor.tile.properties.buildable && this.currency >= 50) {
          var tower = this.add.sprite(this.cursor.x, this.cursor.y, 'tower');
          this.cursor.tile.properties.buildable = false;

          // Set tower properties
          tower.range = 200;

          tower.rangeCircle = this.add.graphics();
          tower.rangeCircle.lineStyle(2, 0x000000, 1);
          tower.rangeCircle.drawCircle(this.cursor.x + 16, this.cursor.y + 16, tower.range * 2);

          tower.inputEnabled = true;
          tower.events.onInputOver.add(function() {this.rangeCircle.visible = true;}, tower);
          tower.events.onInputOut.add(function() {this.rangeCircle.visible = false;}, tower);

          tower.target = null;

          tower.projectiles = this.add.group();
          tower.projectiles.enableBody = true;
          tower.projectiles.physicsBodyType = Phaser.Physics.ARCADE;

          tower.projectiles.createMultiple(50, 'projectile');
          tower.projectiles.setAll('checkWorldBounds', true);
          tower.projectiles.setAll('outOfBoundsKill', true);

          tower.game = this;

          tower.nextFire = 0;
          tower.fireRate = 1000;

          tower.shoot = function() {
            if (this.target && this.game.time.now > this.nextFire) {
              // Calculate next time to shoot
              this.nextFire = this.game.time.now + this.fireRate;

              var projectile = this.projectiles.getFirstDead();
              projectile.damage = 10;
              projectile.reset(this.x + 16, this.y + 16);
              this.game.physics.arcade.moveToObject(projectile, this.target, 800);
            }
          };

          // Pay up
          this.currency -= 50;

          // Give the tile a reference to the tower and add it to towers group
          this.cursor.tile.properties.tower = tower;
          this.towers.add(tower);
        }
      }
    }

  };
};
