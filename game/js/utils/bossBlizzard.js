/*
 * Class for blizzard attacks
 *
 * @enc: environment of game
 * @attacker: attacking party
 * @receiver: receiving party
 * @dam: amount of damage to be done to receiver
 *
 */
function BossBlizzard(enc, attacker, receiver, dam) {
    Attack.call(this, enc, attacker, receiver, dam);
};

BossBlizzard.prototype.start = function () {
    Attack.prototype.start.apply(this);
    
    // one direction of fire attack if attacker is player
    var xLoc = this.receiver.x - (165-this.receiver.width)/2;
    this.enc.blizzard = this.enc.game.add.group();
    var self = this;
    var xLocs = [xLoc, xLoc-40, xLoc+40,xLoc-80,xLoc+80];
    for (var i = 0; i < 5; ++i) {
        setTimeout(function () {
            var xLoc = self.receiver.x - (165-self.receiver.width)/2;
            var neg = Math.floor(Math.random()*2);
            if (neg % 2 === 0) neg = -1;
            else neg = 1;
            var freeze = self.enc.blizzard.create(xLoc+neg*(Math.floor(Math.random()*40)),0,'blizzard');
            freeze.animations.add('falling',[0,1,2,3,4,5,6,7,8,9,10],12,true);
            self.enc.physics.enable(freeze, Phaser.Physics.ARCADE);
            freeze.body.gravity.y = 325;
            freeze.body.collideWorldBounds = true;
            freeze.animations.play('falling');
            self.enc.blizzard_launch.play();
        }, i*300);
    }
};

BossBlizzard.prototype.stop = function (timeout) {
    var self = this;
    // kill attack after timeout
    setTimeout(function () {
        Attack.prototype.stop.apply(self);
    }, timeout);
};
