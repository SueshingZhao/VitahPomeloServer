var roleSchema = require('../schemas/roleSchema');
var mongoose = require('mongoose');
var Role = mongoose.model('Role');

/////////////////////////////////////////////////////////////////////

/**
 * [getByUidNoCreate 获取玩家信息，不存在该玩家时不创建对应表]
 * @param  {[type]}   uid [description]
 * @param  {Function} cb  [description]
 * @return {[type]}       [description]
 */
module.exports.getByUid = function(uid, cb) {
	Role.findOne({
		uid: uid
	}, cb);
};
