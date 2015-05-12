Ninja.Encounter = function (game) {
    this.game = game;
    this.params;
};

Ninja.Encounter.prototype = {
    init: function (param) {
        this.params = param;
    },
    preload: function () {
        this.game.load.crossOrigin = 'Anonymous'

        this.game.load.image('dude', 'assets/Block Ninja/idle.png');
        this.game.load.image('enemy', 'assets/boss_sprites/carrot.png');
        this.game.load.image('background', 'assets/rocklavacave.png');
    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        var bg = this.add.tileSprite(0, 0, 800, 600, 'background');
        bg.fixedToCamera = true;
        this.player = this.add.sprite(90, 325, 'dude');
        this.enemy = this.add.sprite(630, 325, 'enemy');
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.physics.enable(this.enemy, Phaser.Physics.ARCADE);

        this.player.body.gravity.y = 0;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(16,16);

        this.enemy.body.gravity.y = 0;
        this.enemy.body.collideWorldBounds = true;

        pause_label = this.add.text(this.width-110, 5, 'Pause', { font: '24px Arial', fill: '#fff' });
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
        return;
    },
    finish: function (player, door) {
        this.game.state.start('Game', true, false, this.params);
    }
}
