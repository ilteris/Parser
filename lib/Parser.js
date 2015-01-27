var Transform = require ('stream').Transform;
var util = require('util');
var  csv = require('csv-streamify');
var JSONStream = require('JSONStream');

var csvToJson = csv({objectMode: true});

var parser = new Transform();
//currently need to chop the csv into the part we want 
//while it's string, then we can convert it into object.
//to play around with it
parser._transform = function(data,encoding, done) {
	if (this.readingData) {
		this.push(data, encoding)

	} else {
		var start = data.toString().match(/(Account Trade History)((?:\n.+)+)/)
		if (start !== -1) {
			this.readingData = true
			this.push(start[2])
		}
	}

	done();
};

var convert = new Transform({objectMode: true});
convert._transform = function(data, encoding, done) {
	  this.push(data);
	    done();

};


var jsonToStrings = JSONStream.stringify(false);


process.stdin
.pipe(parser)
.pipe(convert)
.pipe(csvToJson)
.pipe(jsonToStrings)
.pipe(process.stdout);

process.stdout.on('error',process.exit);


