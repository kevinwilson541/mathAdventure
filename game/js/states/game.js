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
    this.bossEncounter;
    this.game_music;
};

Ninja.Game.prototype = {
    init: function (param) {
        this.encounterLocs = [];
        this.initX = 48;
        this.initY = 16;
        this.muted = false;
        if (param) {
            this.chestLocs = param.chestLocs;
            this.initX = param.initX || this.initX;
            this.initY = param.initY || this.initY;
            this.muted = param.muted;
        }
    },
    preload: function () {
        this.game.load.crossOrigin = 'Anonymous'
    },
    create: function () {
        this.game_music = this.game.add.audio('music');
        this.game_music.loop = true;
        if (!this.muted) {
            this.game_music.play();
        }
        else {
            this.game_music.mute = true;
        }
        this.coin_music = this.game.add.audio('coinage');
        this.nocoin_music = this.game.add.audio('nocoinage');

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        var map = this.add.tilemap("level1");
        map.addTilesetImage("dungeon", "dungeon_tiles");
        map.setCollisionByExclusion([33,104,49,55,21]);
        this.layer = map.createLayer("Tile Layer 1");
        this.layer.resizeWorld();
        this.player = this.add.sprite(this.initX, this.initY, 'dude');
        //this.portal = this.add.sprite(1288,64,'portal');
        this.boss = this.add.sprite(119*16, 9*16, 'boss_idle');
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        //this.physics.enable(this.portal, Phaser.Physics.ARCADE);
        this.physics.enable(this.boss, Phaser.Physics.ARCADE);

        this.player.body.gravity.y = 0;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(16,16);

        //this.portal.body.gravity.y = 0;
        //this.portal.body.collideWorldBounds = true;

        this.boss.body.gravity.y = 0;
        this.boss.body.collideWorldBounds = true;

        this.player.animations.add('left', [0,1,2,3], 10, true);
        this.player.animations.add('turn', [4], 10, true);
        this.player.animations.add('right', [5,6,7,8], 10, true);

        this.camera.follow(this.player);
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.chests = this.game.add.group();
        this.chests.enableBody = true;

        var self = this;
        if (!this.chestLocs) {
            map.createFromTiles(49,104,'chest',this.layer,this.chests);
            this.chestLocs = {};
            this.chests.forEach(function (child) {
                self.chestLocs[child.x+','+child.y] = 0;
                child.body.gravity.y = 0;
            }, this);
        }
        else {
            Object.keys(this.chestLocs).forEach(function (loc) {
                loc = loc.split(',');
                loc = loc.map(function (item) {
                    return parseInt(item);
                });
                var chest = self.chests.create(loc[0], loc[1], 'chest');
                chest.body.gravity.y = 0;
            });
            map.replace(49,104);
        }
        
        this.fires = this.game.add.group();
        this.fires.enableBody = true;
        map.createFromTiles(55,104,'fire',this.layer,this.fires);
        this.fires.forEach(function (child) {
            child.body.gravity.y = 0;
        }, this);
        var fire = this.fires.create(48,32,'fire');
        fire.body.gravity.y = 0;

        // until we fill the whole map area
        var xTiles = 150;
        var yTiles = 35;
        var notPlayer = function (randLoc) {
            return self.player.x !== randLoc[0] || self.player.y !== randLoc[1];
        };
        for (var i = 0; i < 18; ++i) {
            var randx = Math.floor(Math.random()*xTiles)*16;
            var randy = Math.floor(Math.random()*yTiles)*16;
            if (this.chestLocs[randx+','+randy] === undefined &&
                notPlayer([randx, randy]))
                this.encounterLocs[randx.toString()+','+randy.toString()] = 0;
            
            if (randx+16 <= xTiles*16 && 
                this.chestLocs[randx+16+','+randy] === undefined &&
                notPlayer([randx+16,randy])) 
                this.encounterLocs[(randx+16).toString()+','+randy.toString()] = 0;
            
            if (randx-16 >= 0 &&
                this.chestLocs[randx-16+','+randy] === undefined &&
                notPlayer([randx-16,randy])) 
                this.encounterLocs[(randx-16).toString()+','+randy.toString()] = 0;
            
            if (randy+16 <= yTiles*16 &&
                this.chestLocs[randx+','+randy+16] === undefined &&
                notPlayer([randx, randy+16])) 
                this.encounterLocs[randx.toString()+','+(randy+16).toString()] = 0;
            
            if (randy-16 >= 0 &&
                this.chestLocs[randx+','+randy-16] === undefined &&
                notPlayer([randx, randy-16])) 
                this.encounterLocs[randx.toString()+','+(randy-16).toString()] = 0;
        }

        var mute = this.game.input.keyboard.addKey(77);
        mute.onDown.add(function () {
            if (!self.game_music.mute) {
                self.game_music.mute = true;
            }
            else {
                if (!self.game_music.isPlaying) self.game_music.play();
                self.game_music.mute = false;
            }
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
        this.physics.arcade.collide(this.player, this.layer);
        this.physics.arcade.overlap(this.player, this.chests, this.collect, null, this);
        this.physics.arcade.overlap(this.player, this.fires, this.bossFight, null, this);

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
                playerHealth: 250,
                muted: !this.game_music.mute ? false : true
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

    bossFight: function (player, fire) {
        this.game_music.stop();
        //this.fires.removeAll();
        this.game.state.start('Boss', true, false, {
            initX: Math.floor(this.player.x / 16)*16,
            initY: Math.floor(this.player.y / 16)*16+16,
            chestLocs: this.chestLocs,
            numUses: 1,
            playerHealth: 250,
            muted: !this.game_music.mute ? false : true
        });
    },

    finish: function (player, door) {
        this.game_music.stop();
        var params = {
            'initX': 64,
            'initY': 16,
            'chestLocs': this.chestLocs,
            'muted': !this.game_music.mute ? false : true
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
        var buttons = {
            'chestButton': 'Submit',
            'closeButton': 'Close',
            'acceptButton': 'Accept'
        };
        var $shop = $("#shopContent");
        Object.keys(buttons).forEach(function (item) {
            var $but = $("<button>");
            $but.attr('id', item);
            $but.attr('type', 'button');
            $but.text(buttons[item]);
            $shop.append($but);
        })
        $("#acceptButton").hide();
        $("#chestButton").on('click', function () {
            var answer = $("#chestAnswer").val();
            $("#chestAnswer").hide();
            $("#prompt").hide();
            if (answer.search("[^0-9/.\-]") < 0 && eval(answer) == eval($("#answer").text())) {
                $("#question").text("CORRECT!");
                self.coin_music.play();
            }
            else {
                $("#question").text("INCORRECT");
                self.nocoin_music.play();
            }
            $("#chestAnswer").val('');
            $(this).hide();
            $("#closeButton").hide();
            $("#acceptButton").show();
        });
        $("#closeButton").on('click', function () {
            self.cursors = self.game.input.keyboard.createCursorKeys();
            $("chestAnswer").val('');
            var q = genDiff();
            $("#question").text(q[1].toString());
            $("#answer").text(q[2]);
            $("#prompt").text(q[0]);
            overlay();
        });
        $("#acceptButton").on('click', function () {
            //add items to bag
            self.cursors = self.game.input.keyboard.createCursorKeys();
            var q = genDiff();
            $("#question").text(q[1]);
            $("#prompt").show();
            $("#prompt").text(q[0]);
            $("#answer").text(q[2]);
            $("#chestAnswer").show();
            overlay();
        });
    }
}
