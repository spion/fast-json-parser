function Queue(capacity) {
    this._capacity = capacity;
    this.length = 0;
    for (var k = 0; k < capacity; ++k)
        this[k] = undefined;
}

Queue.prototype.push = function(element) {
    this[this.length++] = element;
}

Queue.prototype.pop = function(element) {
    return this[--this.length];
}


function testArray() {
    var a = []
    for (var j = 0; j < 100000; ++j) {
        for (var k = 0; k < 5; ++k) a.push(k)
        for (var k = 0; k < 5; ++k) a.pop();
    }
    return a.length
}

function testQueue() {
    var q = new Queue(5);
    for (var j = 0; j < 100000; ++j) {
        for (var k = 0; k < 5; ++k) q.push(k)
        for (var k = 0; k < 5; ++k) q.pop();
    }
    return q.length
}


function nTimes(name, f, n) {
    console.time(name);
    while (--n) f();
    console.timeEnd(name)
}

nTimes('array', testArray, 1000);
nTimes('queue', testQueue, 1000);
