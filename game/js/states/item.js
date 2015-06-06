/*
 * class item
 * @param name: string for item name
 * @param quantity: value this item inflicts
 */

function item(name, quantity) {
	this.name = name;
	this.quantity = quantity;
};

/*
 * @param entity: who this item affects (sprite object)
 * @param env: environment to use (game state object)
 */
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

/*
 * class healthPotion
 * @param name: name of object, ending in 'Health Potion'
 * @param quantity: number to set health to
 */
function healthPotion(name, quantity) {
	item.call(this, name, quantity);
};

healthPotion.prototype.use = function (player, env) {
    item.prototype.use.apply(this, [player, env]);
    this.effect = this.env.game.add.tween(this.player).to({tint: 0xFF0000}, 1000, Phaser.Easing.Linear.InOut, true, 0, 0, true);
    var self = this;
    // crop player health bar to whatever percentage of health they have
    // happens before exchange of turns
    setTimeout(function () {
        self.player.health = self.quantity;
        if (self.player.children.length) {
            var hp = self.player.getChildAt(0);
            hp.crop();
            hp.crop(new Phaser.Rectangle(0,0,self.player.health/self.player.maxHealth*hp.width,48));
        }
    }, 1000);
};

/*
 * class attackPotion
 * @param name: name of object, ending in 'Attack Potion'
 * @param quantity: number to increase attack multiplier by
 */
function attackPotion(name, quantity) {
	item.call(this, name, quantity);
};

/*
 * @param player: who this item affects (sprite object)
 * @param env: environment to use (game state object)
 */
attackPotion.prototype.use = function (player, env) {
    item.prototype.use.apply(this, [player, env]);
    this.effect = this.env.game.add.tween(this.player).to({tint: 0x00FF00}, 1000, Phaser.Easing.Linear.InOut, true, 0, 0, true);
    var self = this;
    // increase player attack multiplier
    // happens before exchange of turns
    setTimeout(function () {
        self.player.attackPower += self.quantity;
    }, 1000);
};

/*
 * class retreatPotion
 * @param name: name of object, ending in 'Retreat Potion'
 * @param quantity: number to set retreat percentage success to
 */
function retreatPotion(name, quantity) {
	item.call(this, name, quantity);
};

/*
 * @param player: who this item affects (sprite object)
 * @param env: environment to use (game state object)
 */
retreatPotion.prototype.use = function (player, env) {
    item.prototype.use.apply(this, [player, env]);
    this.effect = this.env.game.add.tween(this.player).to({tint: 0x0000FF}, 1000, Phaser.Easing.Linear.InOut, true, 0, 0, true);
    var self = this;
    // set player retreat success to quantity
    // happens before exchange of turns
    if (self.player.retreatPower) {
        setTimeout(function () {
            self.player.retreatPower = self.quantity;
        }, 1000);
    }
};

/*
 * class itemBag
 * @param bag: object taken from database, meant to store itembag. Has
 * similar form to this class, only missing class names and methods.
 */
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

/*
 * @param item: item object to insert
 */
itemBag.prototype.insert = function (item) {
    if (!item)
	return;
    if (this.items[item.name] !== undefined) {
        this.items[item.name].push(item);
    }
    else this.items[item.name] = [item];
    this.size++;
};

/*
 * @param item: item object key to remove object from (String)
 */
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

/*
 * checks if item bag is empty
 */
itemBag.prototype.empty = function () {
    return this.size == 0;
};

/*
 * returns item bag size
 */
itemBag.prototype.size = function () {
    return this.size;
};

/*
 * @param item: item object key to access (String)
 */
itemBag.prototype.at = function (item) {
    return this.items[item] || [];
};

/*
 * clones this object into another itemBag instance
 */
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

/*
 * class ItemGenerator
 */
function ItemGenerator() {
    this.suffixes = {
        'Health Potion': healthPotion,
        'Retreat Potion': retreatPotion,
        'Attack Potion': attackPotion
    };
}

/*
 * @param item: object to create item off of (Object)
 */
ItemGenerator.prototype.generate = function (item) {
    if (this.suffixes[item.name] !== undefined) {
        return new this.suffixes[item.name](item.name, item.quantity);
    }
    else return new item(item.name, item.quantity);
};

