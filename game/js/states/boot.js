var Ninja = {};
Ninja.Boot = function (game) {
    this.game = game;
};

Ninja.Boot.prototype = {
    preload: function () {
        // hide all the menus and pop ups
        $("#menu").hide();
        $("#game_menu").hide();
        $("#spoils").hide();
        this.load.audio('start_theme', '../../assets/start_theme.mp3');
        this.load.audio('music', '../../assets/dungeon_level.mp3');
        this.load.audio('battle_theme', '../../assets/battle.mp3');
        this.load.audio('coinage','../../assets/coin.wav');

        this.load.image('atari', '../../assets/atari.png');
        this.load.image('raster', '../../assets/pink-raster.png');
        this.load.image('floor', '../../assets/checker-floor.png');
        this.load.image('bluePink', '../../assets/bluepink_font.png');
        this.load.image('loader', '../../assets/loading.jpg');
        this.load.bitmapFont('carrier_command', '../../assets/carrier_command.png', '../../assets/carrier_command.xml');
    },

    create: function () {
        this.game.add.sprite(200,188,'loader');
        // give audio time to load (to avoid delayed playing)
        setTimeout(function () {
            this.game.state.start('MainMenu');
        },7000);
        /*for (var i = 0; i < 7; ++i) {
            setTimeout(function () {
                var audio = this.game.add.audio('coinage');
                audio.play();
            }, i*1000);
        }*/
    }
};
