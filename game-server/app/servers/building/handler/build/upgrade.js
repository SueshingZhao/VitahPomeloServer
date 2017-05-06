'use strict';

var moment = require('moment');
var co = require('co');
var thunkify = require('thunkify');
var buildModel = require('../../../../models/buildModel');
var code = require('../../../../consts/code');
var pushService = require('../../../../services/pushService');

/////////////////////////////////////////////////////////////////////////

/**
 * 建筑升级协议
 * @param  {[type]}   msg     [description]
 * @param  {[type]}   session [description]
 * @param  {Function} next    [description]
 * @return {[type]}           [description]
 */
module.exports = function (msg, session, next) {
    var uid = session.uid;
    var build_id = msg.build_id;

    if (!uid || !build_id) {
        return next(null, {
            code: code.PARAM_ERROR
        });
    }

    var onUpgrade = function* () {
        var build_model = yield thunkify(buildModel.getByUid)(uid);
        var build_old_json = build_model.toJSON();

        var build_item = build_model.getBuild(build_id);
        if (!build_item) {
            return next(null, {
                code: code.BUILD_NOT_EXIST
            });
        }

        // 判断建筑是否在升级
        if (build_item.getUpRemainTime() > 0) {
            return next(null, {
                code: code.BUILD_IS_IN_UPGRADE
            });
        } else {
            // 建筑不在升级中，并且升级结束时间不为0，表示当前建筑上次升级以及完成，升级该建筑
            if (moment(build_item.up_end_time).unix() != moment(0).unix()) {
                build_item.upgrade();
            }
        }

        // 设置建筑升级结束时间
        build_item.setUpEndTime(1000);

        yield build_model.save();

        pushService.pushBuildModify(uid, build_old_json, build_model.toJSON());

        return next(null, {
            code: code.OK,
            result: {
                build_info: build_item.toJSON()
            }
        });
    };

    var onError = function (err) {
        console.error(err);
        return next(null, {
            code: code.FAIL
        });
    };
    co(onUpgrade).catch(onError);
};