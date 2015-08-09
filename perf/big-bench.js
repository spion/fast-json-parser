var Parser  = require('../lib/parser')
var fs      = require('fs');
var through = require('through2')
var oboe    = require('oboe');



function stream() {
    return fs.createReadStream(__dirname + '/file.json', {encoding:'utf8'})
}

var d = '';
var s = stream();

console.time('JSON.parse')
s
.on('data', function(data) {
    if (data != null) d += data.toString();
})
.on('end', function() {
    JSON.parse(d);
    console.timeEnd('JSON.parse')

    var s = stream();
    console.time('json-parser')
    var p = new Parser();
    p.init()
    s
    .on('data', function(data) {
        p.push(data)
    })
    .on('end', function() {
       console.timeEnd('json-parser');
        var ss = stream();
        console.time('oboe')
        oboe(ss).done(function(data) {
          console.timeEnd('oboe')
        });
    })
})

setTimeout(function(){}, 1000)
