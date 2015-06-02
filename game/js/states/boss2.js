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
};

Ninja.Boss.prototype = {
    init: function (param) {
        this.params = param;
        this.finished = false;
        this.enemyHealth = 1000 + Math.floor(Math.random()*100);
        this.playerHealth = this.params.playerHealth;
        this.itemButtonOn = false, this.attackButtonOn = false;
    },
    
    preload: function () {
        this.game.load.crossOrigin = 'Anonymous'
    },

    create: function () {
        this.battle_music = this.game.add.audio('urScrewed');
        this.battle_music.loop = true;
        if (!this.params.muted) this.battle_music.play();
        else this.battle_music.mute = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        var map = this.add.tilemap("battle");
        map.addTilesetImage("dungeon", "dungeon_tiles");
        var layer = map.createLayer("Tile Layer 1");
        layer.resizeWorld();

        this.heartWidth = 144;
        this.heartHeight = 48;

        this.player = this.add.sprite(90, 325, 'ninja');
        this.enemy = this.add.sprite(this.game.width-162, 325, 'boss');
        
        this.player.addChild(new Phaser.Sprite(this.game, -1*(this.heartWidth-this.player.width)/2, -1*this.heartHeight, 'health'));
        this.enemy.addChild(new Phaser.Sprite(this.game, -1*(this.heartWidth-this.enemy.width)/2, -1*this.heartHeight, 'health'));

        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.physics.enable(this.enemy, Phaser.Physics.ARCADE);

        this.player.body.gravity.y = 0;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(16,16);

        this.enemy.body.gravity.y = 0;
        this.enemy.body.collideWorldBounds = true;

        this.arrow = this.game.add.sprite(this.player.width/2-24, -1*this.heartHeight-48,'arrow');
        this.player.addChild(this.arrow);

        var self = this;
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
                // do attacki
                self.enemy.body.bounce.setTo(1,1);
                self.player.body.velocity.x = 500;
                self.enemyHealth -= self.attacks[key];
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
                self.enemy.body.bounce.setTo(1,1);
                self.player.body.velocity.x = 500;
                self.enemyHealth -= self.attacks[key];
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
        self.physics.arcade.overlap(self.player, self.enemy, function() {
            //self.physics.arcade.collide(self.player, self.enemy);
            if (self.enemy.body.velocity.x) self.enemy.body.velocity.x *= -1;
            else self.enemy.body.velocity.x = 500;
            if (self.player.body.velocity.x) self.player.body.velocity.x *= -1;
            else self.player.body.velocity.x = -500;
        });
        if (self.finished) {
            return;
        }
        if (self.enemy.x >= (self.game.width-((self.enemy.width+this.heartWidth)/2))) {
            self.enemy.body.velocity.x = 0;
            self.enemy.body.angularVelocity = 150;
            if (self.enemy.angle >= 90) {
                self.enemy.getChildAt(0).crop(new Phaser.Rectangle(0,0,((self.enemyHealth/200) * self.enemy.getChildAt(0).width),48)); 
                self.player.reset(90, 325);
                if (self.enemyHealth <= 0) {
                    self.finished = true;
                    self.enemy.body.angularVelocity = 0;
                    self.game.add.tween(self.enemy).to({tint: 0x000000}, 1000, Phaser.Easing.Exponential.Out, true, 0, 0, true);
                    setTimeout(function () {
                        return self.end();
                    }, 1000);
                }
                else {
                    self.enemy.reset(this.game.width-162, 325);
                    self.enemy.angle = 0;
                    self.enemyMove();
                }
            }
        }
        else if (self.player.x < Math.abs(self.heartWidth-self.player.width)/2) {
            self.player.body.velocity.x = 0;
            self.player.body.angularVelocity = -150;
            if (self.player.angle <= -90) {
                self.player.getChildAt(0).crop(new Phaser.Rectangle(0,0,((self.playerHealth/250) * self.player.getChildAt(0).width),48)); 
                self.enemy.reset(self.game.width-162,325);
                if (self.playerHealth <= 0) {
                    self.finished = true;
                    self.player.body.angularVelocity = 0;
                    self.game.add.tween(self.player).to({tint: 0x000000}, 1000, Phaser.Easing.Exponential.Out, true, 0, 0, true);
                    setTimeout(function () {
                        return self.end();
                    }, 1000);
                }
                else {
                    self.player.reset(90, 325);
                    self.player.angle = 0;
                    var arrow = self.enemy.removeChildAt(1);
                    self.player.addChild(arrow);
                    self.attackMenuFuncs();
                    self.itemMenuFuncs();
                }
            }
        }
    },

    enemyMove: function () {
        var arrow = this.player.getChildAt(1);
        this.enemy.addChild(arrow);
        var self = this;
        setTimeout(function () {
            var rand = Math.random();
            if (rand <= .4) {
                self.playerHealth -= 25;
            }
            else if (rand <= .7) {
                self.playerHealth -= 50;
            }
            else if (rand <= .9) {
                self.playerHealth -= 75;
            }
            else self.playerHealth -= 100;
            //self.enemy.body.velocity.x = -500;

        }, 1500);
    },

    end: function () {
        this.params.muted = !this.battle_music.mute ? false : true;
        this.battle_music.stop();
        this.menu.empty();
        this.menu.hide();
        if (this.playerHealth <= 0) {
            this.game.state.start("Game", true, false, this.params);
        }
        else {
            this.game.state.start('End');
        }
    }
}
