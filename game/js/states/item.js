// class item.js
function item(name, quantity) {
	this.name = name;
	this.quantity = quantity;
};

item.prototype.use = function (entity, env) {
    this.env = env;
    this.player = entity;
    var self = this;
    if (self.env.enemy !== undefined) {
        console.log(self.player.children);
	setTimeout(function () {
            self.env.enemy.addChild(self.player.removeChildAt(1));
            self.env.enemyMove();
        }, 1100);
    }
};

function healthPotion(name, quantity) {
	item.call(this, name, quantity);
};

healthPotion.prototype.use = function (player, env) {
    item.prototype.use.apply(this, [player, env]);
    this.effect = this.env.game.add.tween(this.player).to({tint: 0xFF0000}, 1000, Phaser.Easing.Linear.InOut, true, 0, 0, true);
    var self = this;
    setTimeout(function () {
        self.player.health = self.quantity;
        if (self.player.children.length) {
            var hp = self.player.getChildAt(0);
            hp.crop();
            hp.crop(new Phaser.Rectangle(0,0,self.player.health/self.player.maxHealth*hp.width,48));
        }
    }, 1000);
};

function attackPotion(name, quantity, env) {
	item.call(this, name, quantity);
};

attackPotion.prototype.use = function (player, env) {
    item.prototype.use.apply(this, [player, env]);
    this.effect = this.env.game.add.tween(this.player).to({tint: 0x00FF00}, 1000, Phaser.Easing.Linear.InOut, true, 0, 0, true);
    var self = this;
    setTimeout(function () {
        self.player.attackPower += self.quantity;
    }, 1000);
};

function retreatPotion(name, quantity) {
	item.call(this, name, quantity);
};

retreatPotion.prototype.use = function (player, env) {
    item.prototype.use.apply(this, [player, env]);
    this.effect = this.env.game.add.tween(this.player).to({tint: 0x0000FF}, 1000, Phaser.Easing.Linear.InOut, true, 0, 0, true);
    var self = this;
    if (self.player.retreatPower) {
        setTimeout(function () {
            self.player.retreatPower = self.quantity;
        }, 1000);
    }
};

function itemBag(bag) {
    this.size = 0;
    this.items = {};
    if (bag) {
        var itemGen = new ItemGenerator();
        this.size = bag.size;
        var self = this;
        Object.keys(bag.items).forEach(function (item) {
            self.items[item] = [];
            bag.items[item].forEach(function (obj) {
                self.items[item].push(itemGen.generate(obj));
            });
        });
    }
};

itemBag.prototype.insert = function (item) {
    if (!item)
	return;
    if (this.items[item.name] !== undefined) {
        this.items[item.name].push(item);
    }
    else this.items[item.name] = [item];
    this.size++;
};

itemBag.prototype.remove = function (item) {
    if (this.items[item] !== undefined &&
        this.items[item].length > 0) {
        this.size--;
        var returnItem = this.items[item].pop();
        if (this.items[item].length === 0) {
            delete this.items[item];
        }
        return returnItem;
    };
    return null;
};

itemBag.prototype.empty = function () {
    return this.size == 0;
};

itemBag.prototype.size = function () {
    return this.size;
};

itemBag.prototype.at = function (item) {
    return this.items[item] || [];
};

itemBag.prototype.clone = function () {
    var ib = new itemBag();
    var self = this;
    Object.keys(this.items).forEach(function (item) {
        var l = self.items[item];
        for (var i = 0; i < l.length; ++i) {
            ib.insert(l[i]);
        }
    });
    return ib;
};

function ItemGenerator() {
    this.suffixes = {
        'Health Potion': healthPotion,
        'Retreat Potion': retreatPotion,
        'Attack Potion': attackPotion
    };
}

ItemGenerator.prototype.generate = function (item) {
    if (this.suffixes[item.name] !== undefined) {
        return new this.suffixes[item.name](item.name, item.quantity);
    }
    else return new item(item.name, item.quantity);
};

