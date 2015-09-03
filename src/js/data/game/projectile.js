'use strict';

/* Projectile data
Create new projectiles by adding them to this file.

Format:
{
  id: Sprite ID
  name: Name of the projectile
  spritesheet: Path to spritesheet
  action: Custom action of the bullet which 
          is called when colliding with enemy
}
*/
module.exports = [
  {
    id: 'prj_normal',
    name: 'Normal Bullet',
    spritesheet: 'assets/game/projectiles/projectile.png',
    action: function() {
    }
  }
];
