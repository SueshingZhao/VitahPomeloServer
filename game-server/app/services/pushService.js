'use strict';

var roleMgr = require('../mgr/roleMgr.js');
var buildMgr = require('../mgr/buildMgr');
var jsonDiffUtil = require('../util/jsonDiffUtil.js');

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


/**
 * 推送用户的建筑信息
 * @param  {[type]} uid      [description]
 * @param  {[type]} old_json [description]
 * @param  {[type]} new_json [description]
 * @return {[type]}          [description]
 */
exports.pushBuildModify = function(uid, old_json, new_json) {
	var params = jsonDiffUtil.getChangedJson(old_json, new_json);
	buildMgr.sendBuildChange(
		uid,
		params,
		function(err, fails) {
			if (err) {
				console.error('send build message error: %j, fail ids: %j', err, fails);
				return;
			}
		}
	);
};
