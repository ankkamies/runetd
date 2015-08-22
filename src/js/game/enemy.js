'use strict';

var Phaser = require('phaser');
var data = require('../data/game/enemy.js');

function Enemy (game, x, y, type) {
  x += 16;
  y += 16;

  Phaser.Sprite.call(this, game, x, y, data[type].id);

  // We don't want to show enemies on screen at creation
  this.alive = false;
  this.exists = false;
  this.visible = false;
  this.health = this.maxHealth;
  this.path = this.game.path.slice();

  // Set health and speed with current wave data
  this.maxSpeed = this.game.wave.data.speed;
  this.speed = this.maxSpeed;
  this.maxHealth = this.game.wave.data.maxHealth;

  // Set start node to first node of path and then remove it so path[0] points to next node
  this.startNode = { x: this.path[0].x, y: this.path[0].y };
  this.path.shift();
  this.x = this.startNode.x;
  this.y = this.startNode.y;

  // Calculate distance and direction to next node
  this.distanceToNextNode = this.game.physics.arcade.distanceToXY(this, this.path[0].x, this.path[0].y);
  this.directionToNextNode = { x: (this.path[0].x - this.x) / this.distanceToNextNode,
                               y: (this.path[0].y - this.y) / this.distanceToNextNode };
}

// Make data accessible for preloading
Enemy.DATA = data;

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  if (this.alive) {
    this.move();
  }
};

Enemy.prototype.setPath = function(path) {
  this.path = path.slice(1);
  this.rotation = this.game.physics.arcade.angleToXY(this, this.path[0].x, this.path[0].y);
};

Enemy.prototype.calculatePath = function() {
  this.game.pathfinder.findPath(Math.floor(this.x/32), Math.floor(this.y/32), 
                           Math.floor(this.game.route.end.x), 
                           Math.floor(this.game.route.end.y), function( path ) {
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

  this.game.pathfinder.calculate();
};

Enemy.prototype.reduceLives = function() {
  this.game.lives -= 1;
};

Enemy.prototype.move = function(game) {
  // Set a flag on destination tile so towers cannot be built in it
  this.destinationTile = this.game.map.getTile(this.game.layers.background.getTileX(this.path[0].x),
                                               this.game.layers.background.getTileY(this.path[0].y));

  var deltatime = this.game.time.now - this.lastMoved;

  this.x += this.directionToNextNode.x * this.speed * deltatime/1000;
  this.y += this.directionToNextNode.y * this.speed * deltatime/1000;
  this.lastMoved = this.game.time.now;
  if (this.game.physics.arcade.distanceToXY(this, this.startNode.x, this.startNode.y) >= this.distanceToNextNode) {
    this.x = this.path[0].x;
    this.y = this.path[0].y;
    this.startNode = { x: this.path[0].x, y: this.path[0].y };

    // Move to next tile
    this.path.shift();

    // If no more tiles left, the enemy has reached end
    if (this.path.length === 0) {
      this.reduceLives();
      this.destroy();
      return;
    }

    // Set sprite rotation
    this.rotation = this.game.physics.arcade.angleToXY(this, this.path[0].x, this.path[0].y);

    // Calculate direction and distance to next node
    this.distanceToNextNode = this.game.physics.arcade.distanceToXY(this, this.path[0].x, this.path[0].y);
    this.directionToNextNode = { x: (this.path[0].x - this.x) / this.distanceToNextNode,
                                 y: (this.path[0].y - this.y) / this.distanceToNextNode };
  }

  // Reset speed
  this.speed = this.maxSpeed;
};

module.exports = Enemy;
