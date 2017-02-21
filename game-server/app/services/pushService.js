var roleMgr = require('../mgr/roleMgr');
var jsonDiffUtil = require('../util/jsonDiffUtil');

/////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 推送用户信息
 * @param  {[type]} uid      [description]
 * @param  {[type]} old_json [description]
 * @param  {[type]} new_json [description]
 * @return {[type]}          [description]
 */
exports.pushRoleModify = function(uid, old_json, new_json) {
	var params = jsonDiffUtil.getChangedJson(old_json, new_json);
	roleMgr.sendRoleChange(
		uid,
		params,
		function(err, fails) {
			if (err) {
				console.error('send role message error: %j, fail ids: %j', err, fails);
				return;
			}
		}
	);
};
