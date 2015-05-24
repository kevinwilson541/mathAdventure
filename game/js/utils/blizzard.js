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
    var xLoc = this.receiver.x - (165-this.receiver.width)/2;
    this.enc.blizzard = this.enc.add.sprite(xLoc,0,'blizzard');
    this.enc.blizzard.animations.add('falling',[0,1,2,3,4,5,6,7,8,9,10], 12, true);
    // other direction of fire attack if attacker is enemy
    this.enc.physics.enable(this.enc.blizzard, Phaser.Physics.ARCADE);
    this.enc.blizzard.body.gravity.y = 325;
    this.enc.blizzard.body.collideWorldBounds = true;

    // play animation, and give firebolt noises as well
    this.enc.blizzard.animations.play('falling');
    this.enc.blizzard_launch.play();
};

Blizzard.prototype.stop = function (timeout) {
    var self = this;
    // kill attack after timeout
    setTimeout(function () {
        Attack.prototype.stop.apply(self);
    }, timeout);
};
