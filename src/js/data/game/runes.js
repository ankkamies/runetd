'use strict';

module.exports = [
	{
		id: 'rune_kri',
		name: 'Kri',
		spritesheet: 'assets/game/runes/rune_kri.png',

		offensiveEffect: {
			text: 'Add 10 maximum damage',
			apply: function (tower) {
				tower.damage[1] += 10;
			}
		},

		defensiveEffect: {
			text: 'Deal 10 damage per second',
			apply: function (enemy, active) {
				if (active) {
       		enemy.health -= 10;
       	}
			}
		},

		supportEffect: {
			text: 'Increase minimum damage by 2',
			apply: function (tower) {
				tower.damage[1] += 2;
			}
		}
	},
	{
		id: 'rune_par',
		name: 'Par',
		spritesheet: 'assets/game/runes/rune_par.png',

		offensiveEffect: {
			text: 'Increase attack speed by 15%',
			apply: function (tower) {
				tower.attackSpeed *= 0.85;
			}
		},

		defensiveEffect: {
			text: 'Slow enemies 10%',
			apply: function (enemy) {
				enemy.speed *= 0.9;
			}
		},

		supportEffect: {
			text: 'Increase attack speed by 5%',
			apply: function (tower) {
				tower.attackSpeed *= 0.95;
			}
		}
	},
	{
		id: 'rune_ri',
		name: 'Ri',
		spritesheet: 'assets/game/runes/rune_ri.png',

		offensiveEffect: {
			text: 'Increase range by 15%',
			apply: function (tower) {
				tower.range *= 1.15;
			}
		},

		defensiveEffect: {
			text: 'Slow enemies 10%',
			apply: function (enemy) {
				enemy.speed *= 0.9;
			}
		},

		supportEffect: {
			text: 'Increase range by 5%',
			apply: function (tower) {
				tower.range *= 1.05;
			}
		}
	},
	{
		id: 'rune_an',
		name: 'An',
		spritesheet: 'assets/game/runes/rune_an.png',

		offensiveEffect: {
			text: 'Increase minimum damage by 10',
			apply: function (tower) {
				tower.damage[0] += 10;
			}
		},

		defensiveEffect: {
			text: 'Slow enemies 10%',
			apply: function (enemy) {
				enemy.speed *= 0.9;
			}
		},

		supportEffect: {
			text: 'Increase minimum damage by 2',
			apply: function (tower) {
				tower.damage[0] += 2;
			}
		}
	}
];
