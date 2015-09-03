'use strict';

module.exports = [
  {
    map: {
      tilemap: 'assets/game/maps/test.json',
      tileset: 'assets/game/tiles/test.png'
    },
    // TODO: Move wave data to tiled
    waves: [
       {
         count: 10,
         maxHealth: 120,
         speed: 100,
         value: 2,
         delay: 40000,
         spawnDelay: 1000
       },
       {
         count: 15,
         maxHealth: 150,
         speed: 100,
         value: 3,
         delay: 40000,
         spawnDelay: 400
       },
       {
         count: 20,
         maxHealth: 180,
         speed: 150,
         value: 3,
         delay: 40000,
         spawnDelay: 350
       },
       {
         count: 20,
         maxHealth: 200,
         speed: 200,
         value: 3,
         delay: 40000,
         spawnDelay: 350
       },
       {
         count: 20,
         maxHealth: 250,
         speed: 100,
         value: 3,
         delay: 40000,
         spawnDelay: 400
       },
       {
         count: 25,
         maxHealth: 250,
         speed: 300,
         value: 2,
         delay: 40000,
         spawnDelay: 800
       },
       {
         count: 30,
         maxHealth: 300,
         speed: 250,
         value: 2,
         delay: 40000,
         spawnDelay: 500
       },
       {
         count: 5,
         maxHealth: 1000,
         speed: 150,
         value: 20,
         delay: 40000,
         spawnDelay: 1500
       },
       {
         count: 1,
         maxHealth: 10000,
         speed: 100,
         value: 100,
         delay: 40000,
         spawnDelay: 100
       }
    ]
  },
  {
    map: {
      tilemap: 'assets/game/maps/test.json',
      tileset: 'assets/game/tiles/test.png'
    },
    waves: [
      {
        count: 20,
        maxHealth: 100,
        speed: 100,
        value: 5,
        delay: 50000,
        spawnDelay: 1000
      },
      {
        count: 15,
        maxHealth: 150,
        speed: 100,
        value: 5,
        delay: 50000,
        spawnDelay: 1000
      }
    ]
  }
];

