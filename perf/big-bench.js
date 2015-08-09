var Parser  = require('../lib/parser')
var fs      = require('fs');
var through = require('through2')
var oboe    = require('oboe');

console.time('jsonParse')

function stream() {
    return fs.createReadStream(__dirname + '/file.json', {encoding:'utf8'})
}

var d = '';
stream().pipe(through(function(data, enc, done) {
    if (data != null) d += data.toString();
    done()
}, function() {
    JSON.parse(d);
    console.timeEnd('jsonParse')

    var s = stream();
    console.time('streamer')
    var p = new Parser();
    p.init()
    s.on('data', function(data) {
        p.push(data)
    });
    s.on('end', function() {
       console.timeEnd('streamer');
        var ss = stream();
        console.time('oboe')
        oboe(ss).done(function(data) {
          console.timeEnd('oboe')
        });
    })
}));

setTimeout(function(){}, 1000)
