'use strict';

var roleSchema = require('../schemas/roleSchema');
var mongoose = require('mongoose');
var Role = mongoose.model('Role');
var modelUtil = require('../util/modelUtil.js');

/////////////////////////////////////////////////////////////////////

/**
 * [getByUidNoCreate 获取玩家信息，不存在该玩家时不创建对应表]
 * @param  {[type]}   uid [玩家ID]
 * @param  {Function} cb  [回调]
 * @return {[type]}       [description]
 */
module.exports.getByUidNoCreate = function(uid, cb) {
	Role.findOne({
		uid: uid
	}, cb);
};

/**
 * [getByUid 获取玩家信息，不存在该玩家时创建对应表]
 * @param  {[type]}   uid [玩家ID]
 * @param  {Function} cb  [回调]
 * @return {[type]}       [description]
 */
module.exports.getByUid = function(uid, cb) {
	modelUtil.getByUid(Role, uid, function(err, role_model) {
		if (!!err) {
			console.error(err);
			return cb(err);
		}

		cb(null, role_model);
	});
};
