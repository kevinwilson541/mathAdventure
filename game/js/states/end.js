Ninja.End = function (game) {
    this.game = game;
};

Ninja.End.prototype = {
    preload: function () {
        this.effect;
        this.image;
        this.image2;
	    this.image3;
        this.font;
	    this.font2;
        this.mask;
        this.victory_music;
    },
    create: function () {
        this.victory_music = this.game.add.audio('victory');
        this.victory_music.loop = true;
        this.victory_music.play();
        this.font = this.game.add.retroFont('bluePink', 32, 32, Phaser.RetroFont.TEXT_SET2, 10);
        this.font.setText("YOU WON!!!!!!", true, 0, 8, Phaser.RetroFont.ALIGN_CENTER);

	    this.font2 = this.game.add.bitmapText(100, 475, 'carrier_command','Press Space To Go Back To Main Menu', 18);

        this.image2 = this.game.add.image(this.world.centerX, 50, this.font);
        this.image2.anchor.set(0.5);
	
        this.game.add.tween(this.image2.scale).to({x:1.2,y:1.2}, 3000, Phaser.Easing.Quartic.InOut, true);
        this.game.add.tween(this.font2.scale).to( { x: .8, y: .8}, 3000, Phaser.Easing.Back.InOut, true);
			
	    var self = this;
        
        var space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(this.trans, this);
        
        var mute = this.game.input.keyboard.addKey(77);
        mute.onDown.add(function () {
            if (self.start_music.mute) self.start_music.mute = false;
            else self.start_music.mute = true;
        }, this);
        var dancer = $("#dancing");
        dancer.css('top', 164);
        dancer.css('left', 236);
        dancer.show();
    },
    update: function () {
        return;
    },
    trans: function () {
        $("#dancing").hide();
        var params = {
            muted: !this.victory_music.mute ? false : true
        };
	    this.victory_music.stop();
        this.game.state.start('MainMenu');
    }
}
