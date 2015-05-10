<<<<<<< HEAD
Ninja.Game = function (game) {
    this.game = game;
    this.player;
    this.layer;
    this.cursors;
    this.portal;
    this.facing;
};

Ninja.Game.prototype = {
    preload: function () {
        this.game.load.crossOrigin = 'Anonymous'

        this.game.load.tilemap("level1", "assets/dungeon1.json", null, Phaser.Tilemap.TILED_JSON)
        this.game.load.image("tiles-1", "assets/dungeon.png")
        this.game.load.spritesheet('dude', 'assets/Block Ninja/Spritesheet.png', 16, 16);
        this.game.load.image('portal', 'assets/door-5.png');
    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        var map = this.add.tilemap("level1");
        map.addTilesetImage("dungeon", "tiles-1");
        map.setCollisionByExclusion([33,104]);
        this.layer = map.createLayer("Tile Layer 1");
        this.layer.resizeWorld();
        this.player = this.add.sprite(48, 16, 'dude');
        this.portal = this.add.sprite(1288,64,'portal');
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.physics.enable(this.portal, Phaser.Physics.ARCADE);

        this.player.body.gravity.y = 0;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(16,16);

        this.portal.body.gravity.y = 0;
        this.portal.body.collideWorldBounds = true;

        this.player.animations.add('left', [0,1,2,3], 10, true);
        this.player.animations.add('turn', [4], 10, true);
        this.player.animations.add('right', [5,6,7,8], 10, true);

        this.camera.follow(this.player);
        this.cursors = this.game.input.keyboard.createCursorKeys();

        pause_label = this.add.text(w-110, 5, 'Pause', { font: '24px Arial', fill: '#fff' });
        pause_label.inputEnabled = true;
        pause_label.fixedToCamera = true;
        
        unpause_label = this.add.text(w-110, 5, 'Resume', { font: '24px Arial', fill: '#fff'});
        unpause_label.inputEnabled = true;
        unpause_label.fixedToCamera = true;
        unpause_label.visible = false;

        pause_label.events.onInputUp.add(function () {
            // When the paus button is pressed, we pause the game
            this.paused = true;
        
            pause_label.visible = false;
            unpause_label.visible = true;
        
            this.input.onDown.add(unpause, self);

            function unpause(event){
            
                this.paused = false;
                pause_label.visible = true;
                unpause_label.visible = false;
            }
        }); 
    },
    update: function () {
        //  Collide the player and the stars with the platforms
        this.physics.arcade.collide(this.player, this.layer);
        this.physics.arcade.overlap(this.player, this.portal, this.finish, null, this);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        if (this.cursors.left.isDown)
        {
            //  Move to the left
            this.player.body.velocity.x = -150;

            if (this.facing !== 'left') {
                this.facing = 'left';
            }
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            // Move to the right
            this.player.body.velocity.x = 150;
            if (this.facing !== 'right') {
                this.facing = 'right';
            }
            this.player.animations.play('right');
        }
        else if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -150;
            if (this.facing == 'left') {
                this.player.animations.play('left');
            }
            else {
                this.player.animations.play('right');
            }
        }
        else if (this.cursors.down.isDown) {
            this.player.body.velocity.y = 150;
            if (this.facing == 'left') {
                this.player.animations.play('left');
            }
            else {
                this.player.animations.play('right');
            }
        }
        else
        {
            //  Stand still
            this.player.animations.stop();
            if (this.facing === 'left') {
                this.player.frame = 4;
            }
            else this.player.frame = 0;
        }

    },
    finish: function (player, door) {
        player.reset(48,16);
    }
}
