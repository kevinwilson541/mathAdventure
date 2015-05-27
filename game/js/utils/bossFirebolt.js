/*
 * Class for firebolt attacks
 *
 * @enc: environment of game
 * @attacker: attacking party
 * @receiver: receiving party
 * @dam: amount of damage to be done to receiver
 *
 */
function BossFirebolt(enc, attacker, receiver, dam) {
    Attack.call(this, enc, attacker, receiver, dam);
};

BossFirebolt.prototype.start = function () {
    Attack.prototype.start.apply(this);
    
    var self = this;
    // one direction of fire attack if attacker is player
    this.enc.fireball = this.enc.game.add.group();
    if (this.attacker === this.enc.player) {
        this.xLoc = this.attacker.width + this.attacker.x;
        this.anims = [11,12,13,14,15,16,17,18,19,20,21];
        this.xVelocity = 476;
    }
    else {
        this.xLoc = this.attacker.x - 65;
        this.anims = [0,1,2,3,4,5,6,7,8,9,10];
        this.xVelocity = -476;
    }
    for (var i = 0; i < 5; ++i) {
        setTimeout(function () {
            var fireball = self.enc.fireball.create(self.xLoc,300,'fireball');
            fireball.animations.add('fire',self.anims, 15, true);
            self.enc.physics.enable(fireball, Phaser.Physics.ARCADE);
            fireball.body.gravity.y = 0;
            fireball.body.collideWorldBounds = true;

            // play animation, and give firebolt noises as well
            fireball.animations.play('fire');
            fireball.body.velocity.x = self.xVelocity;
            self.enc.fireball_launch.play();
        }, i*300);
    }
};

BossFirebolt.prototype.stop = function (timeout) {
    var self = this;
    // kill attack after timeout
    setTimeout(function () {
        Attack.prototype.stop.apply(self);
    }, timeout);
};
