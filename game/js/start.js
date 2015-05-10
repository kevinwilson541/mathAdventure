var Ninja = {};
Ninja.MainMenu = function (game) {
    this.game = game;
};

Ninja.MainMenu.prototype = {
    preload: function () {
        this.effect;
        this.image;
        this.mask;
        this.load.image('atari', 'assets/atari.png');
        this.load.image('raster', 'assets/pink-raster.png');
        this.load.image('floor', 'assets/checker-floor.png');
    },
    create: function () {
        this.mask = new Phaser.Rectangle();
        this.stage.backgroundColor = '#000042';

        //var floor = this.add.image(0, this.height, 'floor');
        //floor.width = 800;
        //floor.anchor.y = 1;
        var floor = this.add.image(0, this.height, 'floor')
        floor.width = 800;
        floor.y = 300;

        this.effect = this.make.bitmapData();
        this.effect.load('atari');

        this.image = this.add.image(this.world.centerX, this.world.centerY, this.effect);
        this.image.anchor.set(0.5);
        this.image.smoothed = false;

        this.mask.setTo(0, 0, this.effect.width, this.cache.getImage('raster').height);

        //  Tween the rasters
        this.add.tween(this.mask).to( { y: -(this.mask.height - this.effect.height) }, 3000, Phaser.Easing.Sinusoidal.InOut, true, 0, 100, true);

        //  Tween the image
        this.add.tween(this.image.scale).to( { x: 4, y: 4 }, 3000, Phaser.Easing.Quartic.InOut, true, 0, 100, true);
        
        var self = this;
        var space = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(this.trans, this);
    },
    update: function () {
        this.effect.alphaMask('raster', this.effect, this.mask);
    },
    trans: function () {
        this.state.start('Game');
    }
}
