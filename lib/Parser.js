var Transform = require ('stream').Transform;
var util = require('util');


var parser = new Transform();
parser._transform = function(data,encoding, done) {
	if (this.readingData) {
		this.push(data, encoding)

	} else {
		var start = data.toString().match(/(Account Trade History)((?:\n.+)+)/)
	//	var start = data.toString().match(/(Account Trade History)/i);
		if (start !== -1) {
			this.readingData = true
			this.push(start[0])

		}
	}

	done();
};

process.stdin
.pipe(parser)
.pipe(process.stdout);

process.stdout.on('error',process.exit);


