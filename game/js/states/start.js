Ninja.MainMenu = function (game) {
    this.game = game;
};

Ninja.MainMenu.prototype = {
    preload: function () {
        this.effect;
        this.image;
        this.image2;
	    this.image3;
        this.font;
	    this.font2;
        this.mask;
        this.start_music;
    },
    create: function () {
        this.start_music = this.game.add.audio('start_theme');
        this.start_music.loop = true;
        this.start_music.play();
        this.font = this.game.add.retroFont('bluePink', 32, 32, Phaser.RetroFont.TEXT_SET2, 10);
        this.font.setText("Math Adventure", true, 0, 8, Phaser.RetroFont.ALIGN_CENTER);

	    this.font2 = this.game.add.bitmapText(100, 500, 'carrier_command','Press Space To Begin Game', 24);
	
        this.image2 = this.game.add.image(this.world.centerX, 50, this.font);
        this.image2.anchor.set(0.5);

        this.mask = new Phaser.Rectangle();
        this.stage.backgroundColor = '#000000';

        var floor = this.game.add.image(0, this.height, 'floor')
        floor.width = 800;
        floor.y = 220;

        this.effect = this.make.bitmapData();
        this.effect.load('atari');

        this.image = this.game.add.image(this.world.centerX, 300, this.effect);
        this.image.anchor.set(0.5);
        this.image.smoothed = false;

        this.mask.setTo(0, 0, this.effect.width, this.cache.getImage('raster').height);

        //  Tween the rasters
        this.game.add.tween(this.mask).to( { y: -(this.mask.height - this.effect.height) }, 3000, Phaser.Easing.Sinusoidal.InOut, true, 0, 100, true);

        //  Tween the image
        this.game.add.tween(this.image.scale).to( { x: 2, y: 2 }, 3000, Phaser.Easing.Quartic.InOut, true);
	         
        this.game.add.tween(this.image2.scale).to( { x: 1.2, y: 1.2 }, 3000, Phaser.Easing.Bounce.Out, true);
		
        this.game.add.tween(this.font2.scale).to( { x: .8, y: .8}, 3000, Phaser.Easing.Back.InOut, true);
			
	    var self = this;
        
        var space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(this.trans, this);
        
        var mute = this.game.input.keyboard.addKey(77);
        mute.onDown.add(function () {
            if (self.start_music.mute) self.start_music.mute = false;
            else self.start_music.mute = true;
        }, this);
    },
    update: function () {
        this.effect.alphaMask('raster', this.effect, this.mask);
    },
    trans: function () {
        var params = {
            muted: !this.start_music.mute ? false : true
        };
	    this.start_music.stop();
        $.get("/retrieve", function (data) {
		console.log("brooo?");
		params["initX"] =  data.playerx;
		params["initY"] = data.playery;
		params["chestLocs"] = data.chestLocs;
		params["playerhealth"] = data.playerhealth;
		this.game.state.start('Loader', true, false, params);
	});
    }
}
