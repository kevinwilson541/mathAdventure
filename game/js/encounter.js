Ninja.Encounter = function (game) {
    this.game = game;
    this.params;
<<<<<<< HEAD
    this.menu;
=======
>>>>>>> 4f676458da1a8903b036690f747da4a1b5ab9e9f
};

Ninja.Encounter.prototype = {
    init: function (param) {
        this.params = param;
    },
    preload: function () {
        this.game.load.crossOrigin = 'Anonymous'

        this.game.load.image('dude', 'assets/Block Ninja/idle.png');
        this.game.load.image('enemy', 'assets/boss_sprites/carrot.png');
<<<<<<< HEAD
        this.game.load.image('health', 'assets/8_bit_heart.png');
        this.game.load.audio('battle_theme', 'assets/battle.mp3');
        this.game.load.tilemap("battle", "assets/battle.json", null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image("tiles-1", "assets/dungeon.png");
    },
    create: function () {
        battle_music = this.game.add.audio('battle_theme');
        battle_music.play('', 0, 1, true);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        var map = this.add.tilemap("battle");
        map.addTilesetImage("dungeon", "tiles-1");
        var layer = map.createLayer("Tile Layer 1");
        layer.resizeWorld();
        this.player = this.add.sprite(90, 325, 'dude');
        this.player.addChild(new Phaser.Sprite(this.game, -36, -36, 'health'));
        this.enemy = this.add.sprite(this.game.width-162, 325, 'enemy');
        this.enemy.addChild(new Phaser.Sprite(this.game, -36, -36, 'health'));
=======
        this.game.load.image('background', 'assets/rocklavacave.png');
    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        var bg = this.add.tileSprite(0, 0, 800, 600, 'background');
        bg.fixedToCamera = true;
        this.player = this.add.sprite(90, 325, 'dude');
        this.enemy = this.add.sprite(630, 325, 'enemy');
>>>>>>> 4f676458da1a8903b036690f747da4a1b5ab9e9f
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.physics.enable(this.enemy, Phaser.Physics.ARCADE);

        this.player.body.gravity.y = 0;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(16,16);

        this.enemy.body.gravity.y = 0;
        this.enemy.body.collideWorldBounds = true;

<<<<<<< HEAD
        pause_label = this.add.text(this.width-110, 5, 'Pause', { font: '24px "Press Start 2P"', fill: '#fff' });
        pause_label.inputEnabled = true;
        pause_label.fixedToCamera = true;
        
        unpause_label = this.add.text(this.width-110, 5, 'Resume', { font: '24px "Press Start 2P"', fill: '#fff'});
=======
        pause_label = this.add.text(this.width-110, 5, 'Pause', { font: '24px Arial', fill: '#fff' });
        pause_label.inputEnabled = true;
        pause_label.fixedToCamera = true;
        
        unpause_label = this.add.text(this.width-110, 5, 'Resume', { font: '24px Arial', fill: '#fff'});
>>>>>>> 4f676458da1a8903b036690f747da4a1b5ab9e9f
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
<<<<<<< HEAD

        this.menu = $("#menu");
        this.menu.append($("<h2>").text("Battle Menu"));
        var $attack_menu = $("<div>");
        $attack_menu.append($("<a name='attacks'>").text("Attack"));
        var $item_menu = $("<div>");
        $item_menu.append($("<a names='items'>").text("Item"));
        var $retreat = $("<div>").append($("<a>").text("Retreat"));
        this.menu.append($attack_menu, $item_menu, $retreat);
        this.menu.show();
=======
>>>>>>> 4f676458da1a8903b036690f747da4a1b5ab9e9f
    },
    update: function () {
        return;
    },
    finish: function (player, door) {
        this.game.state.start('Game', true, false, this.params);
    }
}
