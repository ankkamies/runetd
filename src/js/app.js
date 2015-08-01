'use strict';

var Phaser = require('phaser');

var game = new Phaser.Game(800, 600, Phaser.AUTO);

// Initialize data
var menu = {
  main: require('./data/main.js')(game),
  shop: require('./data/shop.js')(game),
  stages: require('./data/stages.js')(game),
  settings: require('./data/settings.js')(game)
};

// Add states
game.state.add('intro', require('./states/intro.js'));
game.state.add('main', require('./states/menu.js')(menu.main));
game.state.add('shop', require('./states/menu.js')(menu.shop));
game.state.add('stages', require('./states/menu.js')(menu.stages));
game.state.add('settings', require('./states/menu.js')(menu.settings));
game.state.add('game', require('./states/game.js'));
game.state.start('intro');
