var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.crossOrigin = 'Anonymous'

    game.load.tilemap("level1", "assets/dungeon1.json", null, Phaser.Tilemap.TILED_JSON)
    game.load.image("tiles-1", "assets/dungeon.png")
    //game.load.image('sky', 'assets/sky.png');
    //game.load.image('ground', 'assets/platform.png');
    //game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/Block Ninja/Spritesheet.png', 16, 16);

}

var player;
var layer;
var cursors;

var stars;
var score = 0;
var scoreText;
var facing = 'left';

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    //game.add.sprite(0, 0, 'sky');
    var map = game.add.tilemap("level1");
    map.addTilesetImage("dungeon", "tiles-1");
    map.setCollisionByExclusion([4, 104]);
    layer = map.createLayer("Tile Layer 1");
    layer.resizeWorld();
    player = game.add.sprite(32, 16, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.gravity.y = 0;
    player.body.collideWorldBounds = true;
    player.body.setSize(16,16);

    player.animations.add('left', [0,1,2,3], 10, true);
    player.animations.add('turn', [4], 10, true);
    player.animations.add('right', [5,6,7,8], 10, true);

    game.camera.follow(player);
    cursors = game.input.keyboard.createCursorKeys();
    
}


function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, layer);


    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        if (facing !== 'left') {
            facing = 'left';
            player.animations.play('left');
        }
    }
    else if (cursors.right.isDown)
    {
        // Move to the right
        player.body.velocity.x = 150;
        if (facing !== 'right') {
            facing = 'right';
            player.animations.play('right');
        }
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
