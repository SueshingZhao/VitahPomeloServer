'use strict';

var _ = require('lodash');
var co = require('co');
var thunkify = require('thunkify');
var buildModel = require('../../../../models/buildModel');
var code = require('../../../../consts/code');
var pushService = require('../../../../services/pushService');

/////////////////////////////////////////////////////////////////////////

/**
 * [exports 建筑的刷新协议]
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

    var onRefresh = function* () {
        var model_change = false;
        var build_model = yield thunkify(buildModel.getByUid)(uid);
        var build_old_json = build_model.toJSON();

        var refresh_build = {};
        _.each(build_model.getBuildList(), function (build_item) {
            if (build_item.build_id == build_id) {
                if (build_item.isEndUpgrade()) {
                    model_change = true;
                    build_item.upgrade();
                    refresh_build = build_item.toJSON();
                }
            } else {
                if (build_item.isUpgradeTimeUp()) {
                    model_change = true;
                    build_item.upgrade();
                }
            }
        });

        yield build_model.save();

        if (model_change) {
            pushService.pushBuildModify(build_old_json, build_model.toJSON());
        }

        return next(null, {
            code: code.OK,
            result: {
                build_info: refresh_build
            }
        });
    };

    var onError = function (err) {
        console.error(err);
        return next(null, {
            code: code.FAIL
        });
    };
    co(onRefresh).catch(onError);
};