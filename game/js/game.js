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
    this.encounterLocs;
    this.game_music;
};

Ninja.Game.prototype = {
    init: function (param) {
        this.encounterLocs = [];
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
            '1456,544': 0, 
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
        if (param) {
            this.chestLocs = param.chestLocs || this.chestLocs;
            this.initX = param.initX || this.initX;
            this.initY = param.initY || this.initY;
        }
    },
    preload: function () {
        this.game.load.crossOrigin = 'Anonymous'
    },
    create: function () {
        this.game_music = this.game.add.audio('music');
        this.game_music.loop = true;
        this.game_music.play();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        var map = this.add.tilemap("level1");
        map.addTilesetImage("dungeon", "dungeon_tiles");
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

        var xTiles = 99;
        var yTiles = 35;
        for (var i = 0; i < 25; ++i) {
            var randx = Math.floor(Math.random()*xTiles)*16;
            var randy = Math.floor(Math.random()*yTiles)*16;
            this.encounterLocs[randx.toString()+','+randy.toString()] = 0;
            if (randx+16 <= xTiles*16) this.encounterLocs[(randx+16).toString()+','+randy.toString()] = 0;
            if (randx-16 >= 0) this.encounterLocs[(randx-16).toString()+','+randy.toString()] = 0;
            if (randy+16 <= yTiles*16) this.encounterLocs[randx.toString()+','+(randy+16).toString()] = 0;
            if (randy-16 >= 0) this.encounterLocs[randx.toString()+','+(randy-16).toString()] = 0;
        }

        var mute = this.game.input.keyboard.addKey(77);
        mute.onDown.add(function () {
            if (self.game_music.volume) self.game_music.volume = 0;
            else self.game_music.volume = 1;
        }, this);
        var pause = this.game.input.keyboard.addKey(80);
        var txt = new Phaser.Text(this.game, self.game.width/2-50, self.game.height/2, 'Paused', {font: '18px "Press Start 2P"', fill: '#fff'});
        pause.onDown.add(function () {
            if (self.game.paused) {
                self.game.world.remove(txt);
                self.game.paused = false;
            }
            else {
                self.game.world.add(txt);
                self.game.paused = true;
            }
        }, this);
    },
    update: function () {
        //  Collide the player and the stars with the platforms
        this.physics.arcade.collide(this.player, this.layer);
        this.physics.arcade.overlap(this.player, this.portal, this.finish, null, this);
        this.physics.arcade.overlap(this.player, this.chests, this.collect, null, this);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        var loc = [Math.floor(this.player.x / 16) * 16, Math.floor(this.player.y / 16)*16].toString();
        if ((typeof this.encounterLocs[loc]) !== 'undefined') {
            delete this.encounterLocs[loc];
            this.game_music.stop();
            this.game.state.start('Encounter', true, false, {
                initX: Math.floor(this.player.x / 16)*16,
                initY: Math.floor(this.player.y / 16)*16,
                chestLocs: this.chestLocs,
                numUses: 1,
                playerHealth: 250
            });
        }

        else if (this.cursors.left.isDown)
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
        this.game_music.stop();
        var params = {
            'initX': 64,
            'initY': 16,
            'chestLocs': this.chestLocs,
        }
        this.game.state.start('Game', true, false, params);
    },

    collect: function (player, chest) {
        //this.game.paused = true;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.game.input.keyboard.removeKey(Phaser.Keyboard.UP);
        this.game.input.keyboard.removeKey(Phaser.Keyboard.DOWN);
        this.game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
        this.game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
        this.cursors = {
            up: {isDown: false},
            down: {isDown: false},
            left: {isDown: false},
            right: {isDown: false}
        };
        delete this.chestLocs[chest.x.toString()+','+chest.y.toString()];
        chest.kill();
	    overlay();
        var self = this;
        $("#chestButton").on('click', function () {
            self.cursors = self.game.input.keyboard.createCursorKeys();
        });
    }
}
