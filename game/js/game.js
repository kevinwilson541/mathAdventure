Ninja.Game = function (game) {
    this.game = game;
    this.player;
    this.layer;
    this.cursors;
    this.portal;
    this.facing;
    this.chests;
    this.initX;
    this.initY;
    this.chestLocs;
};

var encounterLocs = {

    [0,0].toString() : 0,
    [91, 370].toString() : 0,
    [145, 555].toString() : 0,
    [1150, 370].toString(): 0,
    [260, 443].toString(): 0,
    [586, 234].toString(): 0,
    [682, 680].toString(): 0,
    [429, 120].toString(): 0,
    [539, 283].toString(): 0,
    [521, 489].toString(): 0,
    [482, 367].toString(): 0,
    [1291, 291].toString(): 0,
    [423, 721].toString(): 0,
    [304, 499].toString(): 0,
    [425, 933].toString(): 0,
    [700, 312].toString(): 0,
    [1156, 788].toString(): 0,
    [515, 690].toString(): 0,
    [235, 275].toString(): 0,
    [983, 983].toString(): 0,
    [683, 652].toString(): 0,
    [345, 721].toString(): 0,
    [1128, 745].toString(): 0,
    [752, 525].toString(): 0,
    [722, 367].toString(): 0,
    [852, 624].toString(): 0,
    [1277, 855].toString(): 0,
    [547, 893].toString(): 0,
    [456, 654].toString(): 0,
    [822, 828].toString(): 0,
    [182, 455].toString(): 0,
    [676, 890].toString(): 0,
    [754, 747].toString(): 0,
    [474, 323].toString(): 0,
    [399, 365].toString(): 0,
    [737, 742].toString(): 0,
    [634, 947].toString(): 0,
    [632, 1329].toString(): 0,
    [555, 1200].toString(): 0,
}

Ninja.Game.prototype = {
    init: function (param) {
        this.chestLocs = {
            '32,64': 0,
            '64,64': 0,
            '112,80': 0,
            '16,208': 0,
            '16,288': 0,
            '16,336': 0,
            '64,480': 0,
            '288,352': 0,
            '288,112': 0,
            '464,448': 0,
            '704,368': 0,
            '560,80': 0,
            '688,208': 0,
            '832,256': 0,
            '928,288': 0,
            '1008,32': 0,
            '784,560': 0,
            '1120,528': 0,
            '1088,528': 0,
            '1136,224': 0,
            '1168,224': 0,
            '1456,544': 0, // started getting lazy (or smart)
            '1552,288': 0,
            '1568,288': 0,
            '1360,192': 0,
            '1440,32': 0,
            '1504,256': 0,
            '1280,352': 0,
            '1328,352': 0
        };
        this.initX = 48;
        this.initY = 16;
        console.log(param);
        if (param) {
            this.chestLocs = param.chestLocs || this.chestLocs;
            this.initX = param.initX || this.initX;
            this.initY = param.initY || this.initY;
        }
    },
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
        this.player = this.add.sprite(this.initX, this.initY, 'dude');
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

        var self = this;
        Object.keys(this.chestLocs).forEach(function (loc) {
            loc = loc.split(',');
            loc = loc.map(function (item) {
                return parseInt(item);
            });
            var chest = self.chests.create(loc[0], loc[1], 'chest');
            chest.body.gravity.y = 0;
        });

        pause_label = this.add.text(this.width-110, 5, 'Pause', { font: 'bold 24px Arial', fill: '#fff' });
        pause_label.inputEnabled = true;
        pause_label.fixedToCamera = true;
        
        unpause_label = this.add.text(this.width-110, 5, 'Resume', { font: '24px Arial', fill: '#fff'});
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

        else if(('[' + this.player.x.toString() + ', ' + this.player.y.toString() + ']') in encounterLocs ){
            
            this.player.animations.stop();
            console.log("encounter");
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
        var params = {
            'initX': 64,
            'initY': 16,
            'chestLocs': this.chestLocs
        }
        this.game.state.start('Game', true, false, params);
    },
    collect: function (player, chest) {
        chest.kill();
        delete this.chestLocs[[chest.x, chest.y].toString()];
    }
}
