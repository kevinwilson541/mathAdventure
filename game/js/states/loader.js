Ninja.Loader = function (game) {
    this.game = game;
    this.param;
};

Ninja.Loader.prototype = {
    init: function (param) {
        this.param = param;
    },

    preload: function () {
        this.game.stage.backgroundColor = '0x000000';
        this.preloadBar = this.game.add.sprite(200, 188,'loader');
        this.load.setPreloadSprite(this.preloadBar);

        this.game.load.audio('music', 'assets/dungeon_level.mp3');
        this.game.load.audio('battle_theme', 'assets/battle.mp3');
        this.game.load.audio('nocoinage', 'assets/nocoin.wav');
        this.game.load.audio('urScrewed', 'assets/boss.mp3');
        this.game.load.audio('lightningHit', 'assets/lightningHit.wav');
        this.game.load.audio('victory', 'assets/victory.mp3');
        this.game.load.audio('fireballHit', 'assets/fireball.wav');
        this.game.load.audio('fireballLaunch', 'assets/fireball_launch.wav');
        this.game.load.audio('blizzardLaunch', 'assets/blizzard_launch.wav');
        this.game.load.audio('blizzardHit', 'assets/blizzard_hit.wav');
        this.game.load.audio('windHit', 'assets/windhit.wav');
        this.game.load.audio('windLaunch', 'assets/wind.wav');
        this.game.load.audio('ultimateHit','assets/ultimate_hit.wav');
        this.game.load.audio('ultimateBack', 'assets/ultimate_back.wav');

        // images
        this.game.load.tilemap('level1', 'assets/dungeon_map.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('dungeon_tiles', 'assets/dungeon.png');
        this.game.load.spritesheet('dude', 'assets/Block Ninja/Spritesheet.png', 16, 16);
        this.game.load.spritesheet('lightning', 'assets/lightning.png',160,507);
        this.game.load.spritesheet('fireball', 'assets/fireball.png',65,100);
        this.game.load.spritesheet('blizzard', 'assets/blizzard.png',165,200);
        this.game.load.spritesheet('wind', 'assets/wind.png',65,100);
        this.game.load.spritesheet('ultimate','assets/ultimate_blast.png', 638,290);
        this.game.load.image('boss_idle', 'assets/sephiroth_game.png');
        this.game.load.image('portal', 'assets/door-5.png');
        this.game.load.image('chest', 'assets/question.png');
        this.game.load.image('fire', 'assets/flame.png');

        this.game.load.image('ninja', 'assets/Block Ninja/idle.png');
        this.game.load.image('carrot', 'assets/boss_sprites/carrot.png');	
        this.game.load.image('redball', 'assets/boss_sprites/redball.png');
        this.game.load.image('mustache', 'assets/boss_sprites/mustache.png');
        this.game.load.image('rook', 'assets/boss_sprites/rook.png');
        this.game.load.image('starman', 'assets/boss_sprites/starman.png');

        this.game.load.image('boss', 'assets/boss_sprites/sephiroth.png');
        this.game.load.image('health', 'assets/8_bit_heart.png');
        this.game.load.image('arrow', 'assets/arrow.png');
        this.game.load.tilemap('battle', 'assets/battle.json', null, Phaser.Tilemap.TILED_JSON);

    },

    create: function () {
        this.game.state.start('Game', true, false, this.param); 
    }
}
