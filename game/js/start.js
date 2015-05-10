var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('atari', 'assets/atari.png');
    game.load.image('raster', 'assets/pink-raster.png');
    game.load.image('floor', 'assets/checker-floor.png');
    game.load.image('bluePink', 'assets/bluepink_font.png');
    game.load.audio('start_theme', 'assets/start_theme.mp3');

}

var effect;
var image;
var mask = new Phaser.Rectangle();
var font;
var image2;

function create() {
    start_music = game.add.audio('start_theme');
    start_music.play();
    font = game.add.retroFont('bluePink', 32, 32, Phaser.RetroFont.TEXT_SET2, 10);
    font.setText("Math Adventure", true, 0, 8, Phaser.RetroFont.ALIGN_TOP);

    image2 = game.add.image(game.world.centerX, 50, font);
    image2.anchor.set(0.5);
	
    game.stage.backgroundColor = '#000000';

    var floor = game.add.image(0, game.height, 'floor');
    floor.width = 800;
    floor.anchor.y = 1;

    effect = game.make.bitmapData();
    effect.load('atari');

    image = game.add.image(game.world.centerX, game.world.centerY, effect);
    image.anchor.set(0.5);
    image.smoothed = false;

    mask.setTo(0, 0, effect.width, game.cache.getImage('raster').height);

    //  Tween the rasters
    game.add.tween(mask).to( { y: -(mask.height - effect.height) }, 3000, Phaser.Easing.Sinusoidal.InOut, true, 0, 100, true);

    game.add.tween(image2.scale).to( { x: 1.2, y: 1.2 }, 3000, Phaser.Easing.Bounce.Out, true);
    //  Tween the image
    game.add.tween(image.scale).to( { x: 2, y: 2 }, 3000, Phaser.Easing.Quartic.InOut, true);

}

function update() {

    effect.alphaMask('raster', effect, mask);

}
