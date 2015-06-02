/*
 * Class for lightning strike attacks
 *
 * @enc: environment of game
 * @attacker: attacking party
 * @receiver: receiving party
 * @dam: amount of damage to be done to receiver
 *
 */
function BossLightningStrike(enc, attacker, receiver, dam) {
    Attack.call(this, enc, attacker, receiver, dam);
};

BossLightningStrike.prototype.start = function (timeout) {
    Attack.prototype.start.apply(this);
    var self = this;
    
    // place lightning sprite over center of receiver
    // 160 is width of lightning, hence magic number
    // lightning height is 507
    this.xLoc = this.receiver.x - (160-this.receiver.width)/2;
    this.enc.lightning = this.enc.game.add.group();
    for (var i = 0; i < 5; ++i) {
        setTimeout(function () {
            var neg = Math.floor(Math.random()*2);
            if (neg % 2 === 0) {
                neg = 1;
            }
            else neg = -1;
            var lightning = self.enc.lightning.create(self.xLoc + neg*Math.floor(Math.random()*60),-110,'lightning');
            lightning.animations.add('shoot', [0,1,2,3,4,5,6,7,8,9,10],15,true);
            lightning.animations.play('shoot');
            for (var j = 1; j <= 5; ++j) {
                setTimeout(function () {
                    self.enc.lightning_hit.play();
                }, j*200);
            }
            setTimeout(function () {
                var light = self.enc.lightning.getFirstAlive();
                light.animations.stop('shoot');
                light.kill();
            }, timeout);
        }, i*300);
    }
};

BossLightningStrike.prototype.stop = function (timeout) {
    var self = this;
    // kill lightning animation after timeout
    setTimeout(function () {
        //self.lightning.animations.stop('shoot');
        //self.lightning.kill();
        Attack.prototype.stop.apply(self);
    }, timeout);
};;
