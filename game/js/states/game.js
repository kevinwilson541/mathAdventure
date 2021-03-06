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
    this.attackPower;
    this.game_music;
    this.itemBag;
    this.won;
    this.itemButtonOn;
};

Ninja.Game.prototype = {
    init: function (param) {
        this.encounterLocs = [];
        this.initX = 48;
        this.initY = 16;
        this.muted = false;
        this.itemBag = new itemBag();
        this.won = false;
        this.attackPower = 1;
        this.itemButtonOn = false;
        if (param) {
            this.chestLocs = param.chestLocs;
            this.initX = param.initX || this.initX;
            this.initY = param.initY || this.initY;
	        this.playerHealth = param.playerHealth || 250;
            this.muted = param.muted || this.muted;
            this.itemBag = param.itemBag || this.itemBag;
            this.won = param.won || this.won;
            this.attackPower = param.attackPower || this.attackPower;
        }
    },
    preload: function () {
        this.game.load.crossOrigin = 'Anonymous';
    },
    create: function () {
        this.game_music = this.game.add.audio('music');
        this.coin_music = this.game.add.audio('coinage');
        this.nocoin_music = this.game.add.audio('nocoinage');

        this.game_music.loop = true;
        if (!this.muted) {
            this.game_music.play();
        }
        else this.game_music.mute = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        var map = this.add.tilemap("level1");
        map.addTilesetImage("dungeon", "dungeon_tiles");
        map.setCollisionByExclusion([33,104,49,55,21]);
        this.layer = map.createLayer("Tile Layer 1");
        this.layer.resizeWorld();
        this.player = this.add.sprite(this.initX, this.initY, 'dude');
        this.boss = this.add.sprite(119*16, 9*16, 'boss_idle');
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.physics.enable(this.boss, Phaser.Physics.ARCADE);

        this.player.body.gravity.y = 0;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(16,16);

        this.boss.body.gravity.y = 0;
        this.boss.body.collideWorldBounds = true;

        this.player.animations.add('left', [0,1,2,3], 10, true);
        this.player.animations.add('turn', [4], 10, true);
        this.player.animations.add('right', [5,6,7,8], 10, true);

        // initialize player states and item bag
        this.player.itemBag = this.itemBag;
        this.player.health = this.playerHealth;
        this.player.maxHealth = 250;

        this.camera.follow(this.player);
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.chests = this.game.add.group();
        this.chests.enableBody = true;

        var self = this;
        // if chestLocs isn't defined, create them based off of tiles with
        // tile code 49
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
        
        // create fires group, which surround boss and initiate boss fight
        // upon overlap
        this.fires = this.game.add.group();
        this.fires.enableBody = true;
        map.createFromTiles(55,104,'fire',this.layer,this.fires);
        this.fires.forEach(function (child) {
            child.body.gravity.y = 0;
        }, this);

        var xTiles = map.width;
        var yTiles = map.height;
        var notPlayer = function (randLoc) {
            return self.player.x !== randLoc[0] || self.player.y !== randLoc[1];
        };

        // place random encounters, ignoring player location and chets locations
        for (var i = 0; i < 150; ++i) {
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
                self.game_music.mute = false;
                if (!self.game_music.isPlaying) self.game_music.play();
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

        // if user won previous encounter, give them an item
        if (this.won) {
            var item = self.genRandItem();
            var $spoils = $("#items");
            var $txt = $("<p id='desc'>").text('You have received 1 ' + item.name + '!');
            var $accept = $("<button id='ok'>").text('OK');
            $accept.on('click', function () {
                self.coin_music.play();
                self.player.itemBag.insert(item);
                self.updateMenu(item.name);
                $spoils.empty();
                $("#spoils").hide();
            });
            $spoils.append($txt, $accept);
            $("#spoils").show();
        }

        this.initJQuery();
    },
    initJQuery: function () {
        var self = this;
        this.menu = $("#game_menu");
        // menu title
        this.menu.append($("<h2>").text("Game Menu"));

        // item submenu
        var $item_menu = $("<div>");
        var $item_anchor = $("<a name='items'>").text("Items");
        $item_menu.append($item_anchor);
        var $item_list = $("<ul id='item_list'>");

        // if item bag is empty, populate item submenu with empty li
        if (this.player.itemBag.empty()) {
            $item_list.append($("<li>").text("Empty"));
        }
        else {
            Object.keys(this.player.itemBag.items).forEach(function (key) {
                var name = key.replace("'",'').split(' ').join('_');
                var $elem = $("<li id='li_"+name+"'>");
                var $anchor = $("<a id='"+name+"'>").text(key + "  x"
                    + self.player.itemBag.at(key).length);
                $anchor.on("click", function () {
                    var item = self.player.itemBag.remove(key);

                    // if item can be used, use it
                    if (item) {
                        item.use(self.player, self);
                        if (self.player.itemBag.at(key).length == 0) {
                            $elem.empty();
                            $elem.remove();
                            if ($item_list.children().length === 0) {
                                $item_list.append($("<li>").text("Empty"));
                            }
                        }
			            else {
				            $("#"+name).text(key+"   x"+self.player.itemBag.at(key).length);
			            }
                    }
                });
                $elem.append($anchor);
                $item_list.append($elem);
            });
        }

        $item_list.hide();
        $item_menu.append($item_list);

        // show item submenu based on state of click
        $item_anchor.on("click", function () {
            if (!self.itemButtonOn) {
                self.itemButtonOn = true;
                $item_list.show();
            }
            else {
                self.itemButtonOn = false;
                $item_list.hide();
            }
        });

        var $save = $("<div>");
        var $save_anchor = $("<a id='save'>").text("Save");

        // place game info into database for player's username
	    $save_anchor.on("click", function () {
            var state = {
                playerx: Math.floor(self.player.x), 
                playery: Math.floor(self.player.y), 
                playerHealth: self.player.health, 
                chestLocs: self.chestLocs, 
                playeritems: JSON.stringify(self.player.itemBag)
            };
            var test = {jname: "jason", gname: "grant", aname: "adam"};
            $.post("/save", state, function (data) {
                console.log("Successful save of state");
		    });
	    });
        $save.append($save_anchor);
        
        this.menu.append($item_menu, $save);
        this.menu.show();
    },
    updateMenu: function (key) {
        var self = this;
        var name = key.replace("'",'').split(' ').join('_');

        // if we just placed an item with this key into item bag, initialize jquery element
        if (this.player.itemBag.at(key).length === 1) {
            var $elem = $("<li id='li_"+name+"'>");
            var $item_list = $("#item_list");
            if ($($item_list.children()[0]).text() === 'Empty') {
                $item_list.empty();
            }
            var $anchor = $("<a id='"+name+"'>").text(key + '   x'+this.player.itemBag.at(key).length);
            $anchor.on("click", function () {
                var item = self.player.itemBag.remove(key);
                if (item) {
                    item.use(self.player, self);
                    if (self.player.itemBag.at(key).length == 0) {
                        $elem.empty();
                        $elem.remove();
                        if ($item_list.children().length === 0) {
                            $item_list.append($("<li>").text("Empty"));
                        }
                    }
                }
            });
            $elem.append($anchor);
            $item_list.append($elem);
        }
        else {
            $("#"+name).text(key+"   x"+this.player.itemBag.at(key).length);
        }
    },
    update: function () {
        this.physics.arcade.collide(this.player, this.layer);
        this.physics.arcade.overlap(this.player, this.chests, this.collect, null, this);
        this.physics.arcade.overlap(this.player, this.fires, this.bossFight, null, this);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        var loc = [Math.floor(this.player.x / 16) * 16, Math.floor(this.player.y / 16)*16].toString();

        // if we interesect an encounter location, initiate encounter
        if ((typeof this.encounterLocs[loc]) !== 'undefined') {
            delete this.encounterLocs[loc];
            this.game_music.stop();
            this.menu.empty();
            this.menu.hide();
            this.game.state.start('Encounter', true, false, {
                initX: Math.floor(this.player.x / 16)*16,
                initY: Math.floor(this.player.y / 16)*16,
                chestLocs: this.chestLocs,
                playerHealth: this.player.health,
                muted: !this.game_music.mute ? false : true,
                itemBag: this.player.itemBag,
                attackPower: this.attackPower
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
        this.menu.empty();
        this.menu.hide();
        this.game.state.start('Boss', true, false, {
            initX: Math.floor(this.player.x / 16)*16,
            initY: Math.floor(this.player.y / 16)*16+16,
            chestLocs: this.chestLocs,
            playerHealth: this.player.health,
            muted: !this.game_music.mute ? false : true,
            itemBag: this.player.itemBag,
            attackPower: this.attackPower
        });
    },

   genRandItem: function () {
       var rand = Math.random();
       var it;
        if (rand < .05)
            it = new attackPotion("Attack Potion", .1);
        else if (rand < .3)
            it = new retreatPotion("Retreat Potion", 1);
        else
            it = new healthPotion('Health Potion', this.player.maxHealth);

        return it;
    },


    collect: function (player, chest) {
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

        // delete this chest from memory
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
        $("#chestAnswer").show();
        $("#acceptButton").hide();
        $("#prompt").show();
        $("#question").show();

        // answer submission
        $("#chestButton").on('click', function () {
            var answer = $("#chestAnswer").val();
            $("#chestAnswer").hide();

            // if user's answer is correct, give them item
            if (answer.search("[^0-9/.\-]") < 0 && eval(answer) == eval($("#answer").text())) {
                $("#prompt").text("CORRECT!");
                self.coin_music.play();
                var item = self.genRandItem();
                self.player.itemBag.insert(item);
                self.updateMenu(item.name);
                $("#question").text('You received 1 ' + item.name + '!');
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
            $("#chestAnswer").val('');
            $("#chestAnswer").show();
            var q = genDiff();
            $("#question").text(q[1].toString());
            $("#answer").text(q[2]);
            $("#prompt").text(q[0]);
            overlay();
        });
        $("#acceptButton").on('click', function () {
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
