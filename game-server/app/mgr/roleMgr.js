var eventType = require('../consts/eventType');
var mgrUtil = require('../util/mgrUtil');

//////////////////////////////////////////////////////////////////////////

/**
 * 用户信息推送
 * @param  {[type]}   uid    [用户id]
 * @param  {[type]}   params [推送内容]
 * @param  {Function} cb     [description]
 * @return {[type]}          [description]
 */
exports.sendRoleChange = function(uid, params, cb) {
	mgrUtil.sendStatusMessage(
		[uid],
		eventType.ON_ROLE_CHANGE,
		params,
		cb
	);
};
