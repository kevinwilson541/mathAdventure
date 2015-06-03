var Ninja = {};
Ninja.Boot = function (game) {
    this.game = game;
};

Ninja.Boot.prototype = {
    preload: function () {
        $("#menu").hide();
        $("#game_menu").hide();
        $("#spoils").hide();
        this.load.audio('start_theme', 'assets/start_theme.mp3');
        this.load.audio('music', 'assets/dungeon_level.mp3');
        this.load.audio('battle_theme', 'assets/battle.mp3');

        this.load.image('atari', 'assets/atari.png');
        this.load.image('raster', 'assets/pink-raster.png');
        this.load.image('floor', 'assets/checker-floor.png');
        this.load.image('bluePink', 'assets/bluepink_font.png');
        this.load.image('loader', 'assets/loading.jpg');
        this.load.bitmapFont('carrier_command', 'assets/carrier_command.png', 'assets/carrier_command.xml');
    },

    create: function () {
        this.game.add.sprite(200,188,'loader');
        setTimeout(function () {
            this.game.state.start('MainMenu');
        },7000);
    }
};
