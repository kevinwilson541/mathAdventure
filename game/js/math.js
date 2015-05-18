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
return func(num1, num2);
}

/*
    2 ints add / sub
    1 int mult
*/
function med() {
    var num1 = Math.floor((Math.random()*99)+10);
    var num2 = Math.floor((Math.random()*99)+10);
    var randnum = Math.floor((Math.random()*3)+0);

    

          
}

function hard() {

}

function xhard() {

}
