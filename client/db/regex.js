var mongoose = require('mongoose');
var config_db = require('../config');
var db = mongoose.connect(config_db.db.regex.mongodb);
var log = require('../log');

var dbRegex = new mongoose.Schema({
	id: String,
	title: String,
	regex: String,
	code: String
});

var model = mongoose.model('regex', dbRegex);

var dbRegex = {};

// read one record from mongodb, the first value that is select by condition
// will be setted to result
dbRegex.read = function (condition, cb) {
	if (condition) {
		model.findOne(condition, function (err, value) {
			if (err) {
				log.dblog('error', 'db.read ' + err);
				// TODO
				cb(null);
			} else {
				cb(null, value);
			}
		});
	} else {
		// TODO
		cb(null);
	}
}

// set the default regex
var default_regex = new model({
	id: "default_id",
	title: "default_regex",
	regex: "/^\d+$/",
	code: "console.log('default regex has been save')"
});

// save a new regex to mongodb, if the value isn't legal, the default regex will be save,
// default value is /^d+&/
dbRegex.save = function (value, cb) {
	if (value) {
		// TODO the value match the model ?
		var new_regex = new model(value);

		new_regex.save(function (err, dbvalue) {
			if (err) {
				log.dblog('error', 'dbRegex.save ' + err);
				// TODO error cb
				cb(null);
			} else {
				cb(null, dbvalue);
			}
		});
	} else {
		
		default_regex.save(function (err, default_value) {
			if (err) {
				log.dblog('error', 'dbRegex.save ' + err)
				// TODO error cb
				cb(null);
			} else {
				cb(null, default_value);
			}
		});
	}
}

/**
@param regex is a regex object, regex.id is the condition and title.OTHER_OPTIONS will
be update
@param cb is a callback function
*/
// TODO is or not first find the value ?
dbRegex.modify = function (title, cb) {
	if (title) {
		var tmp = {};
		var condition = title.id,
			update = function (title) {
				if (title.title) {
					tmp.title = title;
				}
				if (title.regex) {
					tmp.regex = regex;
				}
				if (title.code) {
					tmp.code = code;
				}

				return {$set: tmp}
			},
			options = {multi: true};

		model.update(condition, update, options, cb);
	} else {
		cb(null);
	}

}

module.exports = dbRegex;