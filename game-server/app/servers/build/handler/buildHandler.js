var co = require('co');
var thunkify = require('thunkify');
var buildModel = require('../../../models/buildModel');
var code = require('../../../consts/code');
var pushService = require('../../../services/pushService');

/////////////////////////////////////////////////////////////////////////

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

/**
 * 建筑建造协议
 * @param  {[type]}   msg     [description]
 * @param  {[type]}   session [description]
 * @param  {Function} next    [description]
 * @return {[type]}           [description]
 */
Handler.prototype.build = function(msg, session, next) {
	var uid = session.uid;
	var build_type = msg.build_type;
	if (!uid || !build_type) {
		return next(null, {
			code: code.PARAM_ERROR
		});
	}

	var onBuild = function*() {
		var build_model = yield thunkify(buildModel.getByUid)(uid);
		var build_old_json = build_model.toJSON();

		var new_build_id = build_model.addBuild(build_type);
		var build = build_model.getBuild(new_build_id);
		build.setUpEndTime(1000);

		yield build_model.save();

		pushService.pushBuildModify(uid, build_old_json, build_model.toJSON());

		return next(null, {
			code: code.OK
		});
	};

	var onError = function(err) {
		console.error(err);
		return next(null, {
			code: code.FAIL
		});
	};
	co(onBuild).catch(onError);
};
