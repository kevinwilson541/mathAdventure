Ninja.Encounter = function (game) {
    this.game = game;
    this.params;
    this.menu;
    this.turn;
    this.numUses;
    this.enemyHealth;
    this.playerHealth;
    this.battle_music;
    this.itemButtonOn, this.attackButtonOn;
};

Ninja.Encounter.prototype = {
    init: function (param) {
        this.params = param;
        this.turn = true;
        this.numUses = this.params.numUses;
        this.enemyHealth = 100 + Math.floor(Math.random()*100);
        this.itemButtonOn = false, this.attackButtonOn = false;
    },
    
    preload: function () {
        
        this.game.load.crossOrigin = 'Anonymous'

        this.game.load.image('dude', 'assets/Block Ninja/idle.png');
        this.game.load.image('enemy', 'assets/boss_sprites/carrot.png');
        this.game.load.image('health', 'assets/8_bit_heart.png');
        this.game.load.audio('battle_theme', 'assets/battle.mp3');
        this.game.load.tilemap("battle", "assets/battle.json", null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image("tiles-1", "assets/dungeon.png");
    
    },
    
    create: function () {
        this.battle_music = this.game.add.audio('battle_theme');
        this.battle_music.play('', 0, 1, true);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        var map = this.add.tilemap("battle");
        map.addTilesetImage("dungeon", "tiles-1");
        var layer = map.createLayer("Tile Layer 1");
        layer.resizeWorld();

        this.player = this.add.sprite(90, 325, 'dude');
        this.player.addChild(new Phaser.Sprite(this.game, -36, -48, 'health'));
 
        this.enemy = this.add.sprite(this.game.width-162, 325, 'enemy');
        this.enemy.addChild(new Phaser.Sprite(this.game, -1*(144-this.enemy.width)/2, -48, 'health'));

        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.physics.enable(this.enemy, Phaser.Physics.ARCADE);

        this.player.body.gravity.y = 0;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(16,16);

        this.enemy.body.gravity.y = 0;
        this.enemy.body.collideWorldBounds = true;

        pause_label = this.add.text(this.width-110, 5, 'Pause', { font: '24px "Press Start 2P"', fill: '#fff' });
        pause_label.inputEnabled = true;
        pause_label.fixedToCamera = true;
        
        unpause_label = this.add.text(this.width-110, 5, 'Resume', { font: '24px "Press Start 2P"', fill: '#fff'});
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

        var muted = this.game.input.keyboard.addKey(77);
        muted.onDown.add(function () {
            if (self.battle_music.muted) self.battle_music.muted = false;
            else self.battle_music.muted = true;
        }, this);

        this.initJQuery();
    
    },
    
    initJQuery: function () {
        this.menu = $("#menu");
        this.menu.append($("<h2>").text("Battle Menu"));
        
        var $attack_menu = $("<div>");
        var $attack_anchor = $("<a name='attacks'>").text("Attack");
        $attack_menu.append($attack_anchor);
        var $attack_list = $("<ul>");
        var attacks = {
            "Shadowhachi Kick": 25,
            "Buraku Nunchaku": 50,
            "Bullrog Smash": 75,
            "Kenny's Ninja Star": 100
        };

        var self = this;
        Object.keys(attacks).forEach(function (key) {
            var $elem = $("<li>");
            var $anchor = $("<a>").text(key + "  " + attacks[key].toString());
            $anchor.on("click", function () {
            if (self.turn && self.numUses) {
                // do attacki
                self.enemy.body.bounce.setTo(1,1);
                self.player.body.velocity.x += 500;
                self.numUses--;
                self.enemyHealth -= attacks[key];
		        self.menu.hide(); 
                // maybe display a message with the move
                if (self.enemyHealth <= 0) {
                    self.end();
                }
            }
            else {
                window.alert("You can only do " 
                    + self.params.numUses + " actions per turn!");
                }
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
        var $item_list = $("<ul>");
        console.log(this.params.itemBag);
        if (this.params.itemBag === undefined) {
            $item_list.append($("<li>").text("Empty"));
        }
        else {
            Object.keys(this.params.itemBag).forEach(function (item) {
                var $elem = $("<li>");
                var $anchor = $("<a>").text(key + "  x"
                    + self.params.itemBag[key][0]);
                $anchor.on("click", function () {
                    if (self.turn && self.numUses) {
                        self.numUses--;
                        self.params.itemBag[key][0]--;
                        self.useItem(self.player, self.params.itemBag[key][1]);
                        if (self.params.itemBag[key][0] == 0) {
                            delete self.params.itemBag[key];
                            $item_list.remove($elem);
                            if ($item_list.children().length === 0) {
                                $item_list.append($("<li>").text("Empty"));
                            }
                        }
                    }
                    else {
                        window.alert("You can only do" 
                            + self.params.numUses + " actions per turn");
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
        
        var $done = $("<div>");
        var $done_anchor = $("<a>").text("Finish");
        $done_anchor.on("click", function () {
            self.turn = false;
            self.enemyAttacks = self.params.enemyAttacks;
            self.enemyItemUse = self.params.enemyItemUse;
        });
        $done.append($done_anchor);
        
        this.menu.append($attack_menu, $item_menu, $retreat, $done);
        this.menu.show();
    },

    update: function () {
        var self = this;
        self.physics.arcade.overlap(self.player, self.enemy, function() {
            self.physics.arcade.collide(self.player, self.enemy);
            self.player.body.velocity.x *= -2;
        })		
        if (self.enemy.x >= (self.game.width-((self.enemy.width+self.enemy.getChildAt(0).width)/2))) {
            self.enemy.body.velocity.x = 0;
            self.enemy.body.angularVelocity = 150;
        }
        if (self.enemy.angle >= 90) {
            self.enemy.reset(this.game.width-162, 325);
            self.enemy.angle = 0;
            self.player.reset(90, 325);
            self.enemy.getChildAt(0).crop(new Phaser.Rectangle(0,0,((self.enemyHealth/200) * self.enemy.getChildAt(0).width),48)); 
            self.menu.show();
        } 
        if (!this.turn) {
            setTimeout(function () {
                self.turn = true;
                self.numUses = self.params.numUses;
            }, 1000);
        }
    },

    end: function () {
        this.battle_music.stop();
        this.menu.empty();
        this.menu.hide();
        this.game.state.start("Game", true, false, this.params);
    }
}
