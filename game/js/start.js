var Ninja = {};
Ninja.MainMenu = function (game) {
    this.game = game;
};

Ninja.MainMenu.prototype = {
    preload: function () {
        this.effect;
        this.image;
        this.image2;
        this.font;
        this.mask;
        this.load.image('atari', 'assets/atari.png');
        this.load.image('raster', 'assets/pink-raster.png');
        this.load.image('floor', 'assets/checker-floor.png');
        this.load.image('bluePink', 'assets/bluepink_font.png');
        this.load.audio('start_theme', 'assets/start_theme');
    },
    create: function () {
        start_music = this.game.add.audio('start_theme');
        start_music.play();
        this.font = this.game.add.retroFont('bluePink', 32, 32, Phaser.RetroFont.TEXT_SET2, 10);
        this.font.setText("Math Adventure", true, 0, 8, Phaser.RetroFont.ALIGN_TOP);

        this.image2 = this.game.add.image(this.world.centerX, 50, this.font);
        this.image2.anchor.set(0.5);

        this.mask = new Phaser.Rectangle();
        this.stage.backgroundColor = '#000000';

        var floor = this.game.add.image(0, this.height, 'floor')
        floor.width = 800;
        floor.y = 350;

        this.effect = this.make.bitmapData();
        this.effect.load('atari');

        this.image = this.game.add.image(this.world.centerX, this.world.centerY, this.effect);
        this.image.anchor.set(0.5);
        this.image.smoothed = false;

        this.mask.setTo(0, 0, this.effect.width, this.cache.getImage('raster').height);

        //  Tween the rasters
        this.game.add.tween(this.mask).to( { y: -(this.mask.height - this.effect.height) }, 3000, Phaser.Easing.Sinusoidal.InOut, true, 0, 100, true);

        //  Tween the image
        this.game.add.tween(this.image.scale).to( { x: 4, y: 4 }, 3000, Phaser.Easing.Quartic.InOut, true, 0, 100, true);
        
        var self = this;
        var space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(this.trans, this);
    },
    update: function () {
        this.effect.alphaMask('raster', this.effect, this.mask);
    },
    trans: function () {
        this.state.start('Game');
    }
}
