'use strict';

var co = require('co');
var thunkify = require('thunkify');
var code = require('../../../../consts/code');
var buildModel = require('../../../../models/buildModel');
var pushService = require('../../../../services/pushService');

/////////////////////////////////////////////////////////////////////////

/**
 * 建筑建造协议
 * @param  {[type]}   msg     [description]
 * @param  {[type]}   session [description]
 * @param  {Function} next    [description]
 * @return {[type]}           [description]
 */
module.exports = function (msg, session, next) {
    var uid = session.uid;
    var build_type = msg.build_type;
    if (!uid || !build_type) {
        return next(null, {
            code: code.PARAM_ERROR
        });
    }

    var onBuild = function* () {
        var build_model = yield thunkify(buildModel.getByUid)(uid);
        var build_old_json = build_model.toJSON();

        // 添加一个新建筑，并且设置升级结束时间
        var new_build_id = build_model.addBuild(build_type);
        var build = build_model.getBuild(new_build_id);
        build.setUpEndTime(300);

        yield build_model.save();

        pushService.pushBuildModify(build_old_json, build_model.toJSON());

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
    co(onBuild).catch(onError);
};