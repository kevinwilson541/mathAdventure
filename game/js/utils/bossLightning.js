/*
 * Class for lightning strike attacks
 *
 * @enc: environment of game
 * @attacker: attacking party
 * @receiver: receiving party
 * @dam: amount of damage to be done to receiver
 *
 */
function LightningStrike(enc, attacker, receiver, dam) {
    Attack.call(this, enc, attacker, receiver, dam);
};

LightningStrike.prototype.start = function () {
    Attack.prototype.start.apply(this);
    
    // place lightning sprite over center of receiver
    // 160 is width of lightning, hence magic number
    // lightning height is 507
    var xLoc = this.receiver.x - (160-this.receiver.width)/2;
    this.lightning = this.enc.add.sprite(xLoc,-110,'lightning');
    this.lightning.animations.add('shoot', [0,1,2,3,4,5,6,7,8,9,10], 15,true);

    // play animation, and give lightning strike noises as well
    this.lightning.animations.play('shoot');
    this.enc.lightning_hit.play();
    var self = this;
    for (var i = 1; i <=5; ++i) {
        setTimeout(function () {
            self.enc.lightning_hit.play();
        }, i*150);
    }
};

LightningStrike.prototype.stop = function (timeout) {
    var self = this;
    // kill lightning animation after timeout
    setTimeout(function () {
        self.lightning.animations.stop('shoot');
        self.lightning.kill();
        Attack.prototype.stop.apply(self);
    }, timeout);
};;
