/*
 * Class for blizzard attacks
 *
 * @enc: environment of game
 * @attacker: attacking party
 * @receiver: receiving party
 * @dam: amount of damage to be done to receiver
 *
 */
function Blizzard(enc, attacker, receiver, dam) {
    Attack.call(this, enc, attacker, receiver, dam);
};

Blizzard.prototype.start = function () {
    Attack.prototype.start.apply(this);
    
    // one direction of fire attack if attacker is player
    if (this.attacker === this.enc.player) {
        var xLoc = 
        this.enc.blizzard = this.enc.add.sprite(xLoc,300,'blizzard');
        this.enc.fireball.animations.add('fire',[11,12,13,14,15,16,17,18,19,20,21], 15, true);
    }
    // other direction of fire attack if attacker is enemy
    else {
        var xLoc = this.attacker.x - 65;
        this.enc.fireball = this.enc.add.sprite(xLoc,300,'fireball');
        this.enc.fireball.animations.add('fire',[10,9,8,7,6,5,4,3,2,1,0],15,true);
    }
    this.enc.physics.enable(this.enc.fireball, Phaser.Physics.ARCADE);
    this.enc.fireball.body.gravity.y = 0;
    this.enc.fireball.body.collideWorldBounds = true;

    // play animation, and give firebolt noises as well
    this.enc.fireball.animations.play('fire');
    if (this.attacker === this.enc.player) {
        this.enc.fireball.body.velocity.x = 476;
    }
    else {
        this.enc.fireball.body.velocity.x = -476;
    }
    this.enc.fireball_launch.play();
};

Firebolt.prototype.stop = function (timeout) {
    var self = this;
    // kill attack after timeout
    setTimeout(function () {
        Attack.prototype.stop.apply(self);
    }, timeout);
};
