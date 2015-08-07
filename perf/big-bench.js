var Parser = require('../lib/parser')
var fs = require('fs');
var through = require('through2')

console.time('jsonParse')

var d = '';
fs.createReadStream('./file.json', {encoding: 'utf8'}).pipe(through(function(data, enc, done) {
    if (data != null) d += data.toString();
    done()
}, function() {
    JSON.parse(d);
    console.timeEnd('jsonParse')
    var p = new Parser();
    console.time('streamer')
    fs.createReadStream('./file.json', {encoding:'utf8'}).pipe(through(function(data, enc, done) {
        //console.log(data.length)
        if (data != null) p.push(data.toString());
        done();
    }, function(){
        console.timeEnd('streamer')
    }));
}));

setTimeout(function(){}, 1000)
