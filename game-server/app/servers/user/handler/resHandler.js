var co = require('co');
var thunkify = require('thunkify');
var roleModel = require('../../../models/roleModel.js');
var code = require('../../../consts/code.js');
var pushService = require('../../../services/pushService.js');

/////////////////////////////////////////////////////////////////

module.exports = function (app) {
	return new Handler(app);
};

var Handler = function (app) {
	this.app = app;
};

/**
 * 获取玩家信息协议
 * @return {[type]} [description]
 */
Handler.prototype.add = function (msg, session, next) {
	var gold = msg.gold || 0;
	var diamond = msg.diamond || 0;
	var uid = session.uid;
	if (!uid) {
		return next(null, {
			code: code.PARAM_ERROR
		});
	}

	var onDo = function* () {
		// 获取对应Uid的model
		var role_model = yield thunkify(roleModel.getByUid)(uid);

		// 获取未改变前的json
		var role_old_json = role_model.toJSON();

		role_model.addGold(gold);
		role_model.addDiamond(diamond);

		// 数据库保存
		role_model.save();

		// 推送
		pushService.pushRoleModify(uid, role_old_json, role_model.toJSON());

		return next(null, {
			code: code.OK
		});
	};

	var onError = function (err) {
		console.error(err);
		return next(null, {
			code: code.FAIL
		});
	};

	co(onDo).catch(onError);
};