'use strict';

var Phaser = require('phaser');

var game = new Phaser.Game(800, 600, Phaser.AUTO);

game.state.add('game', require('./states/game.js'));
game.state.add('menu', require('./states/menu.js'));
game.state.start('menu');
