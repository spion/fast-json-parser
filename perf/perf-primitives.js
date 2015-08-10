var NumParser = require('../lib/num-parser.js').default
var StringParser = require('../lib/string-parser.js').default
var ConstParser = require('../lib/const-parser.js').default

var np = new NumParser()

var s1 = ', -12.3'
var s2 = '45, '

function exerciseN() {
    np.init(s1.charCodeAt(2))
    np.advance(s1, 3)
    np.advance(s1, 4)
    np.advance(s1, 5)
    np.advance(s1, 6)
    //np.advance(s2, 0)
    //np.advance(s2, 1)
    //np.advance(s2, 2)
    return np.value()
}

var sp = new StringParser()

var ss1 = '"he\\"wo",'
function exerciseS() {
    sp.init(ss1, 0)
    sp.advance(ss1, 1)
    sp.advance(ss1, 2)
    sp.advance(ss1, 3)
    sp.advance(ss1, 4)
    sp.advance(ss1, 5)
    sp.advance(ss1, 6)
    sp.advance(ss1, 7)
    sp.advance(ss1, 8)
    sp.advance(ss1, 9)
    return sp.value()
}


var sc1 = 'false,'

var cp = new ConstParser();

function exerciseC() {
    cp.init(sc1.charCodeAt(0))
    cp.advance(sc1, 1)
    cp.advance(sc1, 2)
    cp.advance(sc1, 3)
    cp.advance(sc1, 4)
    cp.advance(sc1, 5)
    return cp.value()
}

function testNP() {
    console.time('np');
    for (var k = 0; k < 20000000; ++k) {
      exerciseN();
    }
    console.timeEnd('np')
    console.time('parseFloat')
    for (var k = 0; k < 20000000; ++k) {
      parseFloat('-12.3');
    }
    console.timeEnd('parseFloat');
}


function testSP() {
    console.time('sp');
    for (var k = 0; k < 20000000; ++k) {
      exerciseS();
    }
    console.timeEnd('sp')
    console.time('JSON.parse')
    for (var k = 0; k < 20000000; ++k) {
      JSON.parse('"he\\"wo"')
    }
    console.timeEnd('JSON.parse');
}

function testCP() {
    console.time('cp');
    for (var k = 0; k < 40000000; ++k) {
      exerciseC();
    }
    console.timeEnd('cp')
    console.time('JSON.parse')
    for (var k = 0; k < 40000000; ++k) {
      JSON.parse('false')
    }
    console.timeEnd('JSON.parse');
}

testCP()
testNP();
testSP();