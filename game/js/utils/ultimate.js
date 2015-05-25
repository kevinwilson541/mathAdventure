/*
 * Class for lightning strike attacks
 *
 * @enc: environment of game
 * @attacker: attacking party
 * @receiver: receiving party
 * @dam: amount of damage to be done to receiver
 *
 */
function UltimateBlast(enc, attacker, receiver, dam) {
    Attack.call(this, enc, attacker, receiver, dam);
};

UltimateBlast.prototype.start = function () {
    Attack.prototype.start.apply(this);
    
    var xLoc = this.attacker.width+this.attacker.x;
    this.ultimate = this.enc.add.sprite(xLoc,325-145,'ultimate');
    this.ultimate.animations.add('blast', [0,1,2,3,4,5,6,7,8,9,10,11], 15,true);

    this.ultimate.animations.play('blast');
    this.enc.ultimate_hit.play();
    var self = this;
    for (var i = 1; i <=6; ++i) {
        setTimeout(function () {
            self.enc.ultimate_hit.play();
        }, i*300);
    }
};

UltimateBlast.prototype.stop = function (timeout) {
    var self = this;
    // kill lightning animation after timeout
    setTimeout(function () {
        self.ultimate.animations.stop('blast');
        self.ultimate.kill();
        Attack.prototype.stop.apply(self);
    }, timeout);
};;
