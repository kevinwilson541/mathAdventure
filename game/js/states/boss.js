Ninja.Boss = function (game) {
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
    this.itemBag;
};

Ninja.Boss.prototype = {
    init: function (param) {
        this.params = param;
        this.finished = false;
        this.enemyHealth = 1000; 
        this.playerHealth = this.params.playerHealth;
        this.itemButtonOn = false, this.attackButtonOn = false;
        this.itemBag = this.params.itemBag;
    },
    
    preload: function () {
        this.game.load.crossOrigin = 'Anonymous'
    },

    create: function () {
        var self = this;
        this.battle_music = this.game.add.audio('urScrewed');
        this.battle_music.loop = true;
        if (!this.params.muted) this.battle_music.play();
        else this.battle_music.mute = true;

        this.lightning_hit = this.game.add.audio('lightningHit');
        this.fireball_hit = this.game.add.audio('fireballHit');
        this.fireball_launch = this.game.add.audio('fireballLaunch');
	    this.wind_launch = this.game.add.audio('windLaunch');
	    this.wind_hit = this.game.add.audio('windHit');
        this.blizzard_launch = this.game.add.audio('blizzardLaunch');
        this.blizzard_hit = this.game.add.audio('blizzardHit');
        this.ultimate_hit = this.game.add.audio('ultimateHit');
        this.ultimate_back = this.game.add.audio('ultimateBack');

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        var map = this.add.tilemap("battle");
        map.addTilesetImage("dungeon", "dungeon_tiles");
        var layer = map.createLayer("Tile Layer 1");
        layer.resizeWorld();

        this.heartWidth = 144;
        this.heartHeight = 48;

        this.player = this.add.sprite(90, 325, 'ninja');
        this.player.health = this.playerHealth;
        this.player.maxHealth = 250;
        this.player.retreatPower = .75;
        this.player.attackPower = this.params.attackPower;
        this.player.itemBag = this.itemBag.clone();
      
        this.enemy = this.add.sprite(this.game.width-162,325,'boss');
	    this.enemy.health = this.enemyHealth;
        this.enemy.maxHealth = this.enemyHealth;
                
        this.player.addChild(new Phaser.Sprite(this.game, -1*(this.heartWidth-this.player.width)/2, -1*this.heartHeight, 'health'));
        this.enemy.addChild(new Phaser.Sprite(this.game, -1*(this.heartWidth-this.enemy.width)/2, -1*this.heartHeight, 'health'));
        // crop player heart to how much health they have
	    this.player.getChildAt(0).crop(new Phaser.Rectangle(0,0,((self.player.health/self.player.maxHealth)*self.player.getChildAt(0).width), 48));
        
	    this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.physics.enable(this.enemy, Phaser.Physics.ARCADE);

        this.player.body.gravity.y = 0;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(16,16);

        // define player attacks
        this.player.attack = {
            firebolt: function (dam) {
                var fire = new Firebolt(self, self.player, self.enemy, dam);
                fire.start();
                fire.stop(1000);
            },

            blizzard: function (dam) {
                var freeze = new Blizzard(self, self.player, self.enemy, dam);
                freeze.start();
                freeze.stop(1000);
            },

            lightningStrike: function (dam) {
                var lightning = new LightningStrike(self, self.player, self.enemy, dam);
                lightning.start();
                lightning.stop(1500);
            },

            ultimateBlast: function (dam) {
                var ultimate = new UltimateBlast(self, self.player, self.enemy, dam);
                ultimate.start();
                ultimate.stop(2000);
            },
            
            cyclone: function (dam) {
                var windattack = new Wind(self, self.player, self.enemy, dam);
                windattack.start();
                windattack.stop(1750);
            }
        }
        
        this.enemy.body.gravity.y = 0;
        this.enemy.body.collideWorldBounds = true;
        // define enemy attacks
        this.enemy.attack = {
            firebolt: function (dam) {
                var fire = new BossFirebolt(self, self.enemy, self.player, dam);
                fire.start();
                fire.stop(2000);
            },
            blizzard: function (dam) {
                var bliz = new BossBlizzard(self, self.enemy, self.player, dam);
                bliz.start();
                bliz.stop(2000);
            },
            lightningStrike: function (dam) {
                var lightning = new BossLightningStrike(self, self.enemy, self.player, dam);
                lightning.start(1000);
                lightning.stop(2500);
            },
            cyclone: function (dam) {
                var windattack = new Wind(self, self.enemy, self.player, dam);
                windattack.start();
                windattack.stop(1750);
            }
        };

        // add arrow sprite to player to indicate turn
        this.arrow = this.game.add.sprite(this.player.width/2-24, -1*this.heartHeight-48,'arrow');
        this.player.addChild(this.arrow);

        var muted = this.game.input.keyboard.addKey(77);
        muted.onDown.add(function () {
            if (!self.battle_music.mute) {
                self.battle_music.mute = true;
            }
            else {
                if (!self.battle_music.isPlaying) self.battle_music.play(); // we don't start music if starting at muted
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
        // title
        this.menu.append($("<h2>").text("Battle Menu"));
        
        var $attack_menu = $("<div>");
        // attack submenu
        var $attack_anchor = $("<a name='attacks'>").text("Attack");
        $attack_menu.append($attack_anchor);
        var $attack_list = $("<ul id='attack_list'>");
        this.attacks = {
            "Shadowhachi Kick": [25*this.player.attackPower,easy],
            "Buraku Nunchaku": [50*this.player.attackPower,med],
            "Bullrog Smash": [75*this.player.attackPower,hard],
            "Kenny's Ninja Star": [100*this.player.attackPower,xhard]
        };

        var self = this;
        // for each attack, create a list element with an anchor
        Object.keys(this.attacks).forEach(function (key) {
            var $elem = $("<li>");
            var $anchor = $("<a id='"+key.replace("'", '').split(' ').join('_')+"'>").text(key + "  " + self.attacks[key][0].toString());
            $anchor.on("click", function () {
                // do attack
		        self.disableMenu();
            	self.attackQuestions(self.attacks[key]);	
            });
            $elem.append($anchor);
            $attack_list.append($elem);
        });

        $attack_list.hide();
        $attack_menu.append($attack_list);
        // hide or show attack submenu based on state of click
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
        // item submenu
        var $item_anchor = $("<a name='items'>").text("Items");
        $item_menu.append($item_anchor);
        var $item_list = $("<ul id='item_list'>");
        
        // if the itembag is empty, place an empty list element
        if (this.player.itemBag.empty()) {
            $item_list.append($("<li>").text("Empty"));
        }

        // otherwise, populate with the player's items
        else {
            Object.keys(this.player.itemBag.items).forEach(function (key) {
                var name = key.replace("'",'').split(' ').join('_');
                var $elem = $("<li id='li_"+name+"'>");
                var $anchor = $("<a id='"+name+"'>").text(key + "  x"
                    + self.player.itemBag.at(key).length);
                $anchor.on("click", function () {
                    self.disableMenu();
                    
                    // consume item
                    var item = self.player.itemBag.remove(key);
                    
                    // if any item wasa consumed, use it and update item menu
                    if (item) {
                        item.use(self.player, self);
                        if (self.player.itemBag.at(key).length === 0) {
                            $elem.empty();
                            $elem.remove();
                            
                            // if the whole bag is empty, populate item menu with empty li
				            if ($item_list.children().length === 0) {
                                $item_list.append($("<li>").text("Empty"));
                            }
                        }
			            else {
				            $("#" + name).text(key + "   x" + self.player.itemBag.at(key).length);
			            }
                    }
                    else self.enableMenu();
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
        
        this.menu.append($attack_menu, $item_menu);
        this.menu.show();
    },

    attackMenuFuncs: function () {
        // renable attack functions
        var self = this;
        Object.keys(this.attacks).forEach(function (key) {
            var $anchor = $("#" + key.replace("'",'').split(' ').join('_'))
            $anchor.on("click", function () {
                self.disableMenu();
		        self.attackQuestions(self.attacks[key]);
            });
        });
    },

    itemMenuFuncs: function () {
        // renable item use functions
        var self = this;
        if (!this.player.itemBag.empty()) {
            Object.keys(this.player.itemBag.items).forEach(function (key) {
                var name = key.replace("'",'').split(' ').join('_');
                var $anchor = $("#"+name);
                $anchor.on("click", function () {
                    self.disableMenu();
                    var item = self.player.itemBag.remove(key);

                    // if item can be consumed, use it and update menu
                    if (item) {
                        item.use(self.player, self);
                        if (self.player.itemBag.at(key).length == 0) {
                            $("#li_"+name).empty();
                            $("#li_"+name).remove(); 
                            console.log($("#item_list").children().length);

                            // if item bag is empty, populate item menu with empty li
				            if ($("#item_list").children().length === 0) {
                                $("#item_list").append($("<li>").text("Empty"));
                            }
                        }
			            else {
				            $("#" + name).text(key + "   x" + self.player.itemBag.at(key).length);
			            }
                    }
                    else self.enableMenu();
                });
            });
        }
    },
	
    disableMenu: function () {
        // turn off attack menu and item menu use
        Object.keys(this.attacks).forEach(function (key) {
            var $anchor = $("#" + key.replace("'",'').split(' ').join('_'))
            $anchor.off('click');
        });
        if (!this.player.itemBag.empty()) {
            Object.keys(this.player.itemBag.items).forEach(function (key) {
                var $anchor = $("#"+key.replace("'",'').split(' ').join('_'));
                $anchor.off("click");
            });
        }
    },
   
    enableMenu: function() {
        // reenable menu use
	    var self = this;
	    self.attackMenuFuncs();
	    self.itemMenuFuncs();
    },
	
    update: function () {
        var self = this;

        // difference from encounter, in that fireball and blizzard are groups for boss which 
        // is why parameters are passed into overlap callback
        // if fireball exists, check collisions
        if (this.fireball) {
            // in the case of fireballs, we play fireball hit and kill the sprite
            this.physics.arcade.overlap(this.fireball, this.enemy, function (fire, player) {
                this.fireball_hit.play();
                fire.kill();
            }, null, this);
            this.physics.arcade.overlap(this.fireball, this.player, function (player, fire) {
                this.fireball_hit.play();
                fire.kill();
            }, null, this);
        }
        // if wind exists, check collisions
        if (this.wind) {
            this.physics.arcade.overlap(this.wind, this.enemy, function () {
                self.wind_hit.play();
                self.wind.kill();
            }, null, this);
            this.physics.arcade.overlap(this.wind, this.player, function () {
                self.wind_hit.play();
                self.wind.kill();
            }, null, this);
        }
        // if blizzard exists, check collisions
        if (this.blizzard) {
            this.physics.arcade.overlap(this.blizzard, this.player, function (player, freeze) {
                this.blizzard_hit.play();
                freeze.kill();
            }, null, this);
            this.physics.arcade.overlap(this.blizzard, this.enemy, function (freeze, player) {
                this.blizzard_hit.play();
                freeze.kill();
            }, null, this);
        }
        if (self.finished) {
            return;
        }
    },

    attackQuestions: function(key) {
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
        });
        
        // generate question,and update pop up with question information
        var q = key[1]();
        $("#question").text(q[1]);
        $("#prompt").show();
        $("#prompt").text(q[0]);
        $("#answer").text(q[2]);
        $("#chestAnswer").show();

        $("#acceptButton").hide();

        // submission button
        $("#chestButton").on('click', function () {
            var answer = $("#chestAnswer").val();
            $("#chestAnswer").hide();
            $("#prompt").hide();
            // if question is answered correctly, initiate player attack
            if (answer.search("[^0-9/.\-]") < 0 && eval(answer) == eval($("#answer").text())) {
                if (key[0] == 25)			
                    self.player.attack.firebolt(key[0]);
                else if (key[0] == 50)
                    self.player.attack.cyclone(key[0]);
                else if (key[0] == 75)
                    self.player.attack.blizzard(key[0]);
                else if (key[0] == 100)
                    self.player.attack.ultimateBlast(key[0]);
                else
                    console.log("error in questionAttacks functionl logic");
            }
            
            // otherwise, give turn to player
            else {
                $("#question").text("INCORRECT");
                self.enemy.addChild(self.player.removeChildAt(1));
                self.enemyMove();
            }
            $("#chestAnswer").val('');
            $(this).hide();
            $("#closeButton").hide();
	        overlay();
        });
        // on close, reenable menu
        $("#closeButton").on('click', function () {
            $("chestAnswer").val('');
            $("#chestAnswer").show();
            overlay();
	        self.enableMenu();
        });
    },
	
    enemyMove: function () {
        // determine enemy attack at random
        var self = this;
        var randnum = Math.random();
        setTimeout(function () {
            if (randnum <= .4) {
                self.enemy.attack.firebolt(50);
            }
            else if (randnum <= .7) {
                self.enemy.attack.blizzard(100);
            }
            else if (randnum <= .9) {
                self.enemy.attack.lightningStrike(150);
            }
            else self.enemy.attack.lightningStrike(200);
        }, 1500);
    },

    end: function () {
        this.params = {};
        this.params.muted = !this.battle_music.mute ? false : true;
        this.battle_music.stop();
        this.menu.empty();
        this.menu.hide();

        // if player is dead, bring player back to beginning of game (darnnnnnnn)
        if (this.player.health <= 0) {
	        this.params.playerHealth = 250;
            var q = genDiff();
            $("#question").text(q[1]);
            console.log($("#question").text());
            $("#prompt").show();
            $("#prompt").text(q[0]);
            $("#answer").text(q[2]);
            $("#chestAnswer").show();
            this.game.state.start('Game', true, false, this.params);
	        return;
        }

        // otherwise, you win!!!!!
        else {
            this.game.state.start('End');
        }
    }
}
