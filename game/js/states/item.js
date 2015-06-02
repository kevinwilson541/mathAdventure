function item(name, quantity) {
	this.name = name;
	this.quanitity = quantity;
};

item.prototype.use = function (entity) {
	console.log(entity);
};

function healthPotion(name, quantity) {
	item.call(this, name, quantity);
};

healthPotion.prototype.use = function (player) {
	player.health += this.quantity;
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
	player.retreatPotion += this.quantity;
};
