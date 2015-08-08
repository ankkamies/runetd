'use strict';

var Phaser = require('phaser');

module.exports = function(game) {
  return {
    images: [
    {
      id: 'img_logo',
      spritesheet: 'assets/intro/img_background.png',
      size: { 
        x: 1140, 
        y: 720 
      },
      pos: { 
        x: 0, 
        y: 0 
      },
      frames: 1
    }],

    text: [
    {
      id: 'text_anykey',
      text: 'PRESS ANY KEY',
      pos: { 
        x: 450, 
        y: 500 
      },
      style: {
        font: '32px Arial',
        fill: '#ff0044',
        wordWrap: true,
        wordWrapWidth: 300,
        align: 'center'
      },
      tween: {
        properties: {
          alpha: 0.15
        },
        duration: 1500,
        ease: Phaser.Easing.Linear.None,
        autoStart: true,
        delay: 0,
        repeat: Number.MAX_VALUE,
        yoyo: true
      }
    }]
  };
};
