
/*
 * Base class for attack
 *
 * @enc: environment of game
 * @attacker: the attacking party
 * @receiver: the receiving party
 * @dam: amount of damage to be done to receiver
 *
 */
function Attack(enc, attacker, receiver, dam) {
    this.enc = enc;
    this.attacker = attacker;
    this.receiver = receiver;
    this.dam = dam;
};

Attack.prototype.start = function () {
    this.receiver.health -= this.dam;
};

Attack.prototype.stop = function () {
    var self = this;
    // after a second, initiate turn exchange between attacker/receiver
    setTimeout(function () {
        // crop health bar above receiver to new health
        // health bar height is 48, hence the magic number
        self.receiver.getChildAt(0).crop(new Phaser.Rectangle(0,0,((self.receiver.health/self.receiver.maxHealth)*self.receiver.getChildAt(0).width),48));

        // if receiver is dead, initiate return to next state
        // also make the receiver look like it's dying
        if (self.receiver.health <= 0) {
            self.enc.game.add.tween(self.receiver).to({tint:0x000000}, 1000, Phaser.Easing.Exponential.Out, true, 0, 0, true);
            setTimeout(function () {
                return self.enc.end();
            }, 1000);
        }

        // otherwise, pass the turn to the appropriate receiver
        else {
            var arrow = self.attacker.removeChildAt(1);
            self.receiver.addChild(arrow);
            if (self.receiver === self.enc.player) {
                self.enc.attackMenuFuncs();
                self.enc.itemMenuFuncs();
            }
            else {
                self.enc.enemyMove();
            }
        }
    }, 1000);
};

