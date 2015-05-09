var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var h = 600;
var w = 800;

function preload() {
    game.load.crossOrigin = 'Anonymous'

    game.load.tilemap("level1", "assets/dungeon1.json", null, Phaser.Tilemap.TILED_JSON)
    game.load.image("tiles-1", "assets/dungeon.png")
    //game.load.image('sky', 'assets/sky.png');
    //game.load.image('ground', 'assets/platform.png');
    //game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/Block Ninja/Spritesheet.png', 16, 16);
    game.load.image('portal', 'assets/door-5.png');
}

var player;
var layer;
var cursors;
var portal;

var facing = 'left';

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    var map = game.add.tilemap("level1");
    map.addTilesetImage("dungeon", "tiles-1");
    map.setCollisionByExclusion([33,104]);
    layer = map.createLayer("Tile Layer 1");
    layer.resizeWorld();
    player = game.add.sprite(48, 16, 'dude');
    portal = game.add.sprite(1288,64,'portal');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    game.physics.enable(portal, Phaser.Physics.ARCADE);

    player.body.gravity.y = 0;
    player.body.collideWorldBounds = true;
    player.body.setSize(16,16);

    portal.body.gravity.y = 0;
    portal.body.collideWorldBounds = true;

    player.animations.add('left', [0,1,2,3], 10, true);
    player.animations.add('turn', [4], 10, true);
    player.animations.add('right', [5,6,7,8], 10, true);

    game.camera.follow(player);
    cursors = game.input.keyboard.createCursorKeys();

    pause_label = game.add.text(w-110, 5, 'Pause', { font: '24px Arial', fill: '#fff' });
    pause_label.inputEnabled = true;
    pause_label.fixedToCamera = true;
    
    unpause_label = game.add.text(w-110, 5, 'Resume', { font: '24px Arial', fill: '#fff'});
    unpause_label.inputEnabled = true;
    unpause_label.fixedToCamera = true;
    unpause_label.visible = false;

    pause_label.events.onInputUp.add(function () {
        // When the paus button is pressed, we pause the game
        game.paused = true;
	
	pause_label.visible = false;
 	unpause_label.visible = true;
	
	game.input.onDown.add(unpause, self);

	function unpause(event){
		
	    game.paused = false;
	    pause_label.visible = true;
	    unpause_label.visible = false;
    	}
    });   	
    
}


function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.overlap(player, portal, finish, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        if (facing !== 'left') {
            facing = 'left';
        }
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        // Move to the right
        player.body.velocity.x = 150;
        if (facing !== 'right') {
            facing = 'right';
        }
        player.animations.play('right');
    }
    else if (cursors.up.isDown) {
        player.body.velocity.y = -150;
        if (facing == 'left') {
            player.animations.play('left');
        }
        else {
            player.animations.play('right');
        }
    }
    else if (cursors.down.isDown) {
        player.body.velocity.y = 150;
        if (facing == 'left') {
            player.animations.play('left');
        }
        else {
            player.animations.play('right');
        }
    }
    else
    {
        //  Stand still
        player.animations.stop();
        if (facing === 'left') {
            player.frame = 4;
        }
        else player.frame = 0;
    }
    
}

function finish(player, door) {
    player.reset(48,16);
}
