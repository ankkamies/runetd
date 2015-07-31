'use strict';

var Phaser = require('phaser');

var game = new Phaser.Game(800, 600, Phaser.AUTO);

game.state.add('intro', require('./states/intro.js'));
game.state.add('main', require('./states/main.js'));
game.state.add('shop', require('./states/shop.js'));
game.state.add('stages', require('./states/stages.js'));
game.state.add('settings', require('./states/settings.js'));
game.state.add('game', require('./states/game.js'));
game.state.start('intro');
