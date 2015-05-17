Ninja.Game = function (game) {
    this.game = game;
    this.player;
    this.layer;
    this.cursors;
    this.portal;
    this.facing;
    this.chests;
};

var chestLocs = [
    [32, 64],
    [64, 64],
    [112, 80],
    [16, 208],
    [16, 288],
    [16, 336],
    [64, 480],
    [288, 352],
    [288, 112],
    [464,448],
    [704, 368],
    [560, 80],
    [688, 208],
    [832, 256],
    [928, 288],
    [1008, 32],
    [784, 560],
    [1120, 528],
    [1088, 528],
    [1136, 224],
    [1168, 224],
    [1456, 34*16], // started getting lazy (or smart)
    [97*16, 18*16],
    [98*16, 18*16],
    [85*16, 12*16],
    [90*16, 2*16],
    [94*16, 16*16],
    [80*16, 22*16],
    [83*16, 22*16]
];

Ninja.Game.prototype = {
    preload: function () {
        this.game.load.crossOrigin = 'Anonymous'

        this.game.load.tilemap("level1", "assets/dungeon1.json", null, Phaser.Tilemap.TILED_JSON)
        this.game.load.image("tiles-1", "assets/dungeon.png")
        this.game.load.spritesheet('dude', 'assets/Block Ninja/Spritesheet.png', 16, 16);
        this.game.load.image('portal', 'assets/door-5.png');
        this.game.load.image('chest', 'assets/question.png');
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

        this.chests = this.game.add.group();
        this.chests.enableBody = true;

        for (var i = 0; i < chestLocs.length; ++i) {
            var chest = this.chests.create(chestLocs[i][0], chestLocs[i][1], 'chest');
            chest.body.gravity.y = 0;
        }

        pause_label = this.add.text(800-110, 5, 'Pause', { font: '24px Arial', fill: '#fff' });
        pause_label.inputEnabled = true;
        pause_label.fixedToCamera = true;
        
        unpause_label = this.add.text(800-110, 5, 'Resume', { font: '24px Arial', fill: '#fff'});
        unpause_label.inputEnabled = true;
        unpause_label.fixedToCamera = true;
        unpause_label.visible = false;
        
        var self = this;
        pause_label.events.onInputUp.add(function () {
            // When the paus button is pressed, we pause the game
            self.game.paused = true;
        
            pause_label.visible = false;
            unpause_label.visible = true;
        
            self.game.input.onDown.add(unpause, self);

            function unpause(event){
            
                self.game.paused = false;
                pause_label.visible = true;
                unpause_label.visible = false;
            }
        }); 
    
    },
    update: function () {
        //  Collide the player and the stars with the platforms
        this.physics.arcade.collide(this.player, this.layer);
        this.physics.arcade.overlap(this.player, this.portal, this.finish, null, this);
        this.physics.arcade.overlap(this.player, this.chests, this.collect, null, this);

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
    },
    collect: function (player, chest) {
        chest.kill();
	this.game.paused = true;  	
	overlay();
         
	var button = document.getElementById('chestButton');
	
	var self = this;	
	button.addEventListener("click", function (){
		var answer = document.getElementById('chestAnswer').value;
		alert(answer);
		overlay();
		self.game.paused = false;
	});
    },  
}
