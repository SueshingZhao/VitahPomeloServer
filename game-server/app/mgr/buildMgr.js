var eventType = require('../consts/eventType');
var mgrUtil = require('../util/mgrUtil');

////////////////////////////////////////////////////////////////////////////

/**
 * 发送建筑消息
 * @param  {[type]}   role_id [用户id]
 * @param  {[type]}   params  [推送内容]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
exports.sendBuildChange = function(role_id, params, cb) {
	mgrUtil.sendStatusMessage(
		[role_id],
		eventType.ON_BUILD_CHANGE,
		params,
		cb
	);
};
