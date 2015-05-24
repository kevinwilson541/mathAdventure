/*
 * Class for firebolt attacks
 *
 * @enc: environment of game
 * @attacker: attacking party
 * @receiver: receiving party
 * @dam: amount of damage to be done to receiver
 *
 */
function Firebolt(enc, attacker, receiver, dam) {
    Attack.call(this, enc, attacker, receiver, dam);
};

Firebolt.prototype.start = function () {
    Attack.prototype.start.apply(this);
    
    if (this.attacker === this.enc.player) {
        var xLoc = this.attacker.width + this.attacker.x;
        this.fireball = this.enc.add.sprite(xLoc,300,'fireball');
        this.fireball.animations.add('fire',[21,20,19,18,17,16,15,14,13,12,11], 15, true);
    }
    else {
        var xLoc = this.attacker.x - 65;
        this.fireball = this.enc.add.sprite(xLoc,300,'fireball');
        this.fireball.animations.add('fire',[0,1,2,3,4,5,6,7,8,9,10],15,true);
    }

    // play animation, and give lightning strike noises as well
    this.fireball.animations.play('fire');
    this.enc.fireball_launch.play();
    var self = this;
    this.enc.physics.arcade.overlap(this.fireball, this.receiver, function () {
        self.enc.fireball_hit.play();
        self.fireball.kill();
    }, null, this.enc);
};

Firebolt.prototype.stop = function (timeout) {
    var self = this;
    // kill lightning animation after timeout
    setTimeout(function () {
        self.lightning.animations.stop('shoot');
        self.lightning.kill();
        Attack.prototype.stop.apply(self);
    }, timeout);
};
