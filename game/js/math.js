function add(a,b) {
	return a+b;
}

function sub(a,b) {
	return a-b;
}

function div(a,b) {
	return a/b;
}

function mult(a,b) {
	return a*b;
}

function remainder(a, b) {
return a % b;
}

function easy() {

var randnum = Math.floor((Math.random()*100)+0);
var num1 = Math.floor((Math.random()*10)+0);
var num2 = Math.floor((Math.random()*10)+0);
var func;

if (randnum % 2 != 0) {
	func = sub;
	if (num1 < num2)
		num1 += num2;
}
else
	func = add;
this.result = func(num1, num2);
this.question = 
}

function med() {

}

function hard() {

}

function xhard() {

var randnum = Math.floor((Math.random()*100)+0);
var num1 = Math.floor((Math.random()*100)+20);
var num2 = Math.floor((Math.random()*100)+30);
var func;

if (randnum % 4 == 0) 
	func = sub;
else if (randnum % 4 == 1)
	func = add;
else 
else
	func = add;
return func(num1, num2);

}
