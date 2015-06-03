function easy() {
    var randnum = Math.floor(Math.random()*2);
    if (randnum % 2 === 0) {
        var q = genOOO(0,10);
        var ans = eval(q);
        return ['What is the answer to:',q,ans];
    }
    var q = genAddMul(0,10);
    var ans = eval(q);
    return ['What is the answer to:',q,ans];
}

function med() {
    var randnum = Math.floor(Math.random()*2);
    if (randnum % 2 === 0) {
        var q = genOOO(0,15);
        var ans = eval(q);
        return ['What is the answer to:',q,ans];
    }
    var q = genAddMul(0,15);
    var ans = eval(q);
    return ['What is the answer to:',q,ans];
}

function hard() {
    var randnum = Math.floor(Math.random()*2);
    if (randnum % 2 === 0) {
        var q = genOOO(0,20);
        var ans = eval(q);
        return ['What is the answer to:',q,ans];
    }
    var q = genAddMul(0,20);
    var ans = eval(q);
    return ['What is the answer to:',q,ans];
}

function xhard() {
    var seq = genSeq(1,1);
    var ans = seq.pop();
    return ['Find the next number in this sequence:',seq,ans];
}

function genOOO(depth, lim) {
    if (depth === 0) {
        var randnum = Math.floor(Math.random()*4);
        var op = '';
        if (randnum % 4 === 0) op = ' + ';
        else if (randnum === 1) op = ' - ';
        else if (randnum === 2) op = ' * ';
        else op = ' / ';
        var num1 = Math.floor(Math.random()*lim+1);
        var num2 = Math.floor(Math.random()*lim+1);
        var num3 = Math.floor(Math.random()*lim+1);
        var num4 = Math.floor(Math.random()*lim+1);
        return '('+num1+'/'+num2+')'+op+'('+num3+'/'+num4+')';
    }
    else {
        var randnum = Math.floor(Math.random()*4);
        var op = '';
        if (randnum % 4 === 0)  op = ' + ';
        else if (randnum === 1) op = ' - ';
        else if (randnum === 2) op = ' * ';
        else op = ' / ';
        return '('+genOOO(depth-1,lim)+')'+op+'('+genOOO(depth-1,lim)+')';
    }
}

function genSeq(ops, terms) {
    var opTable = {
        0: '+',
        1: '-',
        2: '*',
    };
    var det = '';
    for (var i = 1; i <= terms; ++i) {
        for (var j = 1; j <= ops; ++j) {
            var num = Math.floor(Math.random()*4 + 1);
            var op = Math.floor(Math.random()*3) % 3;
            det += opTable[op]+num + ':';
        }
        det += '|';
    }
    det = det.substr(0,det.length-1).split('|');
    det = det.map(function (item) {
        item = item.substr(0,item.length-1);
        item = item.split(':');
        item.map(function (elem) {
            return elem.split('');
        });
        return item
    });
    var start = Array.apply(null, new Array(terms)).map(function () {
        return 1;
    });
    for (var i = 0; i < 6; ++i) {
        var val = 0;
        for (var j = 0; j < terms; ++j) {
            var inner = start[start.length-terms+j];
            for (var k = 0; k < ops; ++k) {
                var op = det[j][k][0];
                if (op === '+') inner += parseInt(det[j][k][1]);
                else if (op === '-') inner -= parseInt(det[j][k][1]);
                else inner *= parseInt(det[j][k][1]);
            }
            val += inner;
        }
        start.push(val);
    }
    return start;
}

function genSer(seq) {
    return seq.reduce(function (prev, curr) {
        prev.push(curr + prev[prev.length-1]);
        return prev;
    }, [0]);
}

function genAddMul(depth, lim) {
    if (depth === 0) {
        var randnum = Math.floor(Math.random()*3);
        var op = '';
        if (randnum % 3 === 0) op = ' + ';
        else if (randnum === 1) op = ' - ';
        else if (randnum === 2) op = ' * ';
        var num1 = Math.floor(Math.random()*lim+1);
        var num2 = Math.floor(Math.random()*lim+1);
        return num1+op+num2;
    }
    else {
        var randnum = Math.floor(Math.random()*3);
        var op = '';
        if (randnum % 3 === 0)  op = ' + ';
        else if (randnum === 1) op = ' - ';
        else if (randnum === 2) op = ' * ';
        return '('+genOOO(depth-1,lim)+')'+op+'('+genOOO(depth-1,lim)+')';
    }
}
