// class item.js
function item(name, quantity) {
	this.name = name;
	this.quantity = quantity;
};

item.prototype.use = function (entity) {
	console.log(entity);
};

function healthPotion(name, quantity) {
	item.call(this, name, quantity);
};

healthPotion.prototype.use = function (player) {
	player.health = this.quantity;
    var hp = player.getChildAt(0);
    hp.crop();
    hp.crop(new Phaser.Rectangle(0,0,player.health/player.maxHealth*hp.width,48));
};

function attackPotion(name, quantity) {
	item.call(this, name, quantity);
};

attackPotion.prototype.use = function (player) {
	player.attackPower += this.quantity;
};

function retreatPotion(name, quantity) {
	item.call(this, name, quantity);
};

retreatPotion.prototype.use = function (player) {
	player.retreatPower = this.quantity;
};

function itemBag() {
    this.size = 0;
    this.items = {};
};

itemBag.prototype.insert = function (item) {
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
        return this.items[item].pop();
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
    return this.items[item];
};

itemBag.prototype.clone = function () {
    var ib = new itemBag();
    var self = this;
    Object.keys(this.items).forEach(function (item) {
        var l = self.items[key];
        for (var i = 0; i < l.length; ++i) {
            ib.insert(l[i]);
        }
    });
    return ib;
};
