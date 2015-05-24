Ninja.Encounter = function (game) {
    this.game = game;
    this.params;
    this.menu;
    this.turn;
    this.enemyHealth;
    this.playerHealth;
    this.battle_music;
    this.itemButtonOn, this.attackButtonOn;
    this.heartWidth;
    this.heartHeight;
};

Ninja.Encounter.prototype = {
    init: function (param) {
        this.params = param;
        this.finished = false;
        this.enemyHealth = 100 + Math.floor(Math.random()*100);
        this.playerHealth = this.params.playerHealth;
        this.itemButtonOn = false, this.attackButtonOn = false;
    },
    
    preload: function () {
        this.game.load.crossOrigin = 'Anonymous'
    },

    create: function () {
        var self = this;
        this.battle_music = this.game.add.audio('battle_theme');
        this.battle_music.loop = true;
        if (!this.params.muted) this.battle_music.play();
        else this.battle_music.mute = true;
        this.lightning_hit = this.game.add.audio('lightningHit');
        this.fireball_hit = this.game.add.audio('fireballHit');
        this.fireball_launch = this.game.add.audio('fireballLaunch');
	this.wind_launch = this.game.add.audio('windLaunch');
	this.wind_hit = this.game.add.audio('windHit');

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        var map = this.add.tilemap("battle");
        map.addTilesetImage("dungeon", "dungeon_tiles");
        var layer = map.createLayer("Tile Layer 1");
        layer.resizeWorld();

        this.heartWidth = 144;
        this.heartHeight = 48;

        this.player = this.add.sprite(90, 325, 'ninja');
        this.player.health = this.playerHealth;
        this.player.maxHealth = this.playerHealth;
        this.enemy = this.add.sprite(this.game.width-162, 325, 'enemy');
        this.enemy.health = this.enemyHealth;
        this.enemy.maxHealth = this.enemyHealth;
                
        this.player.addChild(new Phaser.Sprite(this.game, -1*(this.heartWidth-this.player.width)/2, -1*this.heartHeight, 'health'));
        this.enemy.addChild(new Phaser.Sprite(this.game, -1*(this.heartWidth-this.enemy.width)/2, -1*this.heartHeight, 'health'));

        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.physics.enable(this.enemy, Phaser.Physics.ARCADE);

        this.player.body.gravity.y = 0;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(16,16);

        this.player.attack = {
            firebolt: function (dam) {
                var fire = new Firebolt(self, self.player, self.enemy, dam);
                fire.start();
                fire.stop(1000);
            },

            /*blizzard: function (dam) {
                var freeze = new Blizzard(self, self.player, self.enemy, dam);
                freeze.start();
                freeze.stop(1000);
            },*/

            lightningStrike: function (dam) {
                var lightning = new LightningStrike(self, self.player, self.enemy, dam);
                lightning.start();
                lightning.stop(1000);
            },

           /* ultimateBlast: function (dam) {
                var ultimate = new UltimateBlast(self, self.player, self.enemy, dam);
                ultimate.start();
                ultimate.stop(1000);
            },*/
           
            
            cyclone: function (dam) {
                var windattack = new Wind(self, self.player, self.enemy, dam);
                windattack.start();
                windattack.stop(1000);
            }
        }

        this.enemy.body.gravity.y = 0;
        this.enemy.body.collideWorldBounds = true;
        this.enemy.attack = {
            firebolt: function (dam) {
                var fire = new Firebolt(self, self.enemy, self.player, dam);
                fire.start();
                fire.stop(1000);
            },
            lightningStrike: function (dam) {
                var lightning = new LightningStrike(self, self.enemy, self.player, dam);
                lightning.start();
                lightning.stop(1000);
            }
        };

        this.arrow = this.game.add.sprite(this.player.width/2-24, -1*this.heartHeight-48,'arrow');
        this.player.addChild(this.arrow);

        var muted = this.game.input.keyboard.addKey(77);
        muted.onDown.add(function () {
            if (!self.battle_music.mute) {
                self.battle_music.mute = true;
            }
            else {
                if (!self.battle_music.isPlaying) self.battle_music.play();
                self.battle_music.mute = false;
            }
        }, this);

        var paused = this.game.input.keyboard.addKey(80);
        var txt = new Phaser.Text(this.game, self.game.width/2-50, self.game.height/2, 'Paused', {font: '18px "Press Start 2P"', fill: '#fff'});
        paused.onDown.add(function () {
            if (self.game.paused) {
                self.game.world.remove(txt);
                self.game.paused = false;
            }
            else {
                self.game.world.add(txt);
                self.game.paused = true;
            }
        });

        this.initJQuery();
    
    },
    
    initJQuery: function () {
        this.menu = $("#menu");
        this.menu.append($("<h2>").text("Battle Menu"));
        
        var $attack_menu = $("<div>");
        var $attack_anchor = $("<a name='attacks'>").text("Attack");
        $attack_menu.append($attack_anchor);
        var $attack_list = $("<ul id='attack_list'>");
        this.attacks = {
            "Shadowhachi Kick": 25,
            "Buraku Nunchaku": 50,
            "Bullrog Smash": 75,
            "Kenny's Ninja Star": 100
        };

        var self = this;
        Object.keys(this.attacks).forEach(function (key) {
            var $elem = $("<li>");
            var $anchor = $("<a id='"+key.replace("'", '').split(' ').join('_')+"'>").text(key + "  " + self.attacks[key].toString());
            $anchor.on("click", function () {
                // do attack
	    	
            var q = genDiff();
            $("#question").text(q[1]);
            $("#prompt").show();
            $("#prompt").text(q[0]);
            $("#answer").text(q[2]);
            $("#chestAnswer").show();
            overlay();
                self.player.attack.firebolt(self.attacks[key]);
                $anchor.off('click'); 
            });
            $elem.append($anchor);
            $attack_list.append($elem);
        });

        $attack_list.hide();
        $attack_menu.append($attack_list);
        $attack_anchor.on("click", function () {
            if (!self.attackButtonOn) {
                self.attackButtonOn = true;
                $attack_list.show();
            }
            else {
                self.attackButtonOn = false;
                $attack_list.hide();
            }
        });
        
        var $item_menu = $("<div>");
        var $item_anchor = $("<a name='items'>").text("Items");
        $item_menu.append($item_anchor);
        var $item_list = $("<ul id='item_list'>");
        if (this.params.itemBag === undefined) {
            $item_list.append($("<li>").text("Empty"));
        }
        else {
            Object.keys(this.params.itemBag).forEach(function (key) {
                var $elem = $("<li>");
                var $anchor = $("<a id='"+key.replace("'",'').split(' ').join('_')+"'>").text(key + "  x"
                    + self.params.itemBag[key][0]);
                $anchor.on("click", function () {
                    self.params.itemBag[key][0]--;
                    self.useItem(self.player, self.params.itemBag[key][1]);
                    $anchor.off('click');
                    if (self.params.itemBag[key][0] == 0) {
                        delete self.params.itemBag[key];
                        $item_list.remove($elem);
                        if ($item_list.children().length === 0) {
                            $item_list.append($("<li>").text("Empty"));
                        }
                    }
                });
                $elem.append($anchor);
                $item_list.append($elem);
            });
        }

        $item_list.hide();
        $item_menu.append($item_list);
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
        
        var $retreat = $("<div>");
        var $retreat_anchor = $("<a>").text("Retreat");
        $retreat_anchor.on("click", function () {
            self.end();
        });
        $retreat.append($retreat_anchor);
        
        this.menu.append($attack_menu, $item_menu, $retreat);
        this.menu.show();
    },

    attackMenuFuncs: function () {
        var self = this;
        Object.keys(this.attacks).forEach(function (key) {
            var $anchor = $("#" + key.replace("'",'').split(' ').join('_'))
            $anchor.on("click", function () {
                self.player.attack.firebolt(self.attacks[key]);
                $anchor.off('click'); 
            });
        });
    },

    itemMenuFuncs: function () {
        var self = this;
        if (this.params.itemBag !== undefined) {
            Object.keys(this.params.itemBag).forEach(function (key) {
                var $anchor = $("<a id='"+key.replace("'",'').split(' ').join('_')+"'>");
                $anchor.on("click", function () {
                    self.params.itemBag[key][0]--;
                    self.useItem(self.player, self.params.itemBag[key][1]);
                    $anchor.off('click');
                    if (self.params.itemBag[key][0] == 0) {
                        delete self.params.itemBag[key];
                        $item_list.remove($elem);
                        if ($item_list.children().length === 0) {
                            $item_list.append($("<li>").text("Empty"));
                        }
                    }
                });
            });
        }
    },

    update: function () {
        var self = this;
        if (this.fireball) {
            this.physics.arcade.overlap(this.fireball, this.enemy, function () {
                this.fireball_hit.play();
                this.fireball.kill();
            }, null, this);
            this.physics.arcade.overlap(this.fireball, this.player, function () {
                this.fireball_hit.play();
                this.fireball.kill();
            }, null, this);
        }
	if (this.wind) {
    		this.physics.arcade.overlap(this.wind, this.enemy, function () {
            	this.wind_hit.play();
	    	this.wind.animations.stop('w');
            	this.wind.kill();
        	}, null, this);
    		this.physics.arcade.overlap(this.wind, this.player, function () {
            	this.wind_hit.play();
	    	this.wind.animations.stop('w');
            	this.wind.kill();
        	}, null, this);
	}
	
        if (self.finished) {
            return;
        }
    },

    enemyMove: function () {
        var self = this;
        var randnum = Math.random();
        setTimeout(function () {
            if (randnum <= .4) {
                self.enemy.attack.firebolt(25);
            }
            else if (randnum <= .7) {
                self.enemy.attack.firebolt(50);
            }
            else if (randnum <= .9) {
                self.enemy.attack.lightningStrike(75);
            }
            else self.enemy.attack.lightningStrike(100);
        }, 1500);
    },

    end: function () {
        this.params.muted = !this.battle_music.mute ? false : true;
        this.battle_music.stop();
        this.menu.empty();
        this.menu.hide();
        this.game.state.start("Game", true, false, this.params);
    }
}
