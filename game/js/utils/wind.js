/*
 * Class for wind attacks
 *
 * @enc: environment of game
 * @attacker: attacking party
 * @receiver: receiving party
 * @dam: amount of damage to be done to receiver
 *
 */
function Wind(enc, attacker, receiver, dam) {
    Attack.call(this, enc, attacker, receiver, dam);
};

Wind.prototype.start = function () {
    Attack.prototype.start.apply(this);
    if (this.attacker === this.enc.player) {
        var xLoc = this.attacker.width + this.attacker.x;
        this.enc.wind = this.enc.add.sprite(xLoc,300,'wind');
        this.enc.wind.animations.add('w',[0,1,2,3,4,5,6,7,8,9,10], 15, true);

    }
    else {
        var xLoc = this.attacker.x - 65;
        this.enc.wind = this.enc.add.sprite(xLoc,300,'wind');
        this.enc.wind.animations.add('w',[0,1,2,3,4,5,6,7,8,9,10],15,true);
    }
	
    // play animation, and give lightning strike noises as well
    
    this.enc.physics.enable(this.enc.wind, Phaser.Physics.ARCADE);
    this.enc.wind.body.gravity.y = 0;
    this.enc.wind.body.collideWorldBounds = true;
    if (this.attacker == this.enc.player) {
	this.enc.wind.body.velocity.x = 450;
    } else {
	this.enc.wind.body.velocity.x = -450;
    }
    
    this.enc.wind.animations.play('w');
    this.enc.wind_launch.play();
    var self = this;
};

Wind.prototype.stop = function (timeout) {
    var self = this;
    setTimeout(function () {
        Attack.prototype.stop.apply(self);
    }, timeout);
};
