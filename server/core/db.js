var mongoose = require('mongoose');
var _ = require("underscore");

var log = require('./log');
var ListSchema = require('../dao/ListDao');
var RegexSchema = require('../dao/RegexDao');
var ChatUserSchema = require('../dao/ChatUserDao');

var RegexModel = mongoose.model('regex');
var ListModel = mongoose.model('list');
var ChatUserModel = mongoose.model('chatUser');

var db = {};

mongoose.connect(config.mongodb.url);

/******buffer********/
var regex = null;
var list = null;
// var user = null;	// I had done it in user.js! but I forget...TAT
/******buffer********/

// ChatUserModel.find({}, function (err, doc) {
// 	if(err) {
// 		console.log(err);
// 		return cb(err);
// 	}else {
// 		user = doc;
// 	}
// });

// regex
db.findRegex = function(cb) {
	// var results = new Array();
	// results.push({keys:"aaa", cmd: "res.wait('view')"});
	// results.push({keys:"ccc", cmd: "res.wait('view2')"});
	if(regex == null) {
		RegexModel.Find({}, function (err, doc) {
			regex = doc;
			if(err){
				return cb(1);
			}
			return cb(null, doc);
		});
	}else {
		return cb(null, regex);
	}
};

// list
db.findList = function(cb) {
	// var results = new Array();
	// result1 = {
	// 	key: "view",
	// 	views: [
	// 		{key: "reply {a} look my name", val: "res.nowait('ltc')"},
	// 		{key: "reply {b} look my age", val: "res.reply('22')"}
	// 	],
	// }
	// result2 = {
	// 	key: "view2",
	// 	views: [
	// 		{key: "reply {a} look my name222", val: "res.nowait('ltc222')"},
	// 		{key: "reply {b} look my age222", val: "res.reply('22222')"}
	// 	],
	// }
	// results.push(result1);
	// results.push(result2);
	
	if(list == null) {
		ListModel.Find({}, function (err, doc) {
			if(err){
				return cb(1);
			}
			list = doc;
			return cb(null, doc);
		});
	}else {
		return cb(null, list);
	}
};

// user
// return: 1 用户已注册，or other info
db.addUser = function (u, cb) {
	ChatUserModel.count({openid: u.openid}, function (err, count) {
		if(!err && count == 0) {
			ChatUserModel.createUser(u, cb);
		}else if(!err) {
			return cb(1);
		}else {
			return cb(2);
		}
	});
}

db.delUser = function (openid, cb) {
	ChatUserModel.remove({openid: openid}, cb);
}

db.updateUser = function (userObj, cb) {
	ChatUserModel.findOneAndUpdate({openid: userObj.openid}, userObj, cb);
}

db.findUser = function (openid, cb) {
	ChatUserModel.findOne({openid: openid}, cb);
}

module.exports = db;