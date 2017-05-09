'use strict';

var co = require('co');
var thunkify = require('thunkify');
var code = require('../../../../consts/code');
var buildModel = require('../../../../models/buildModel');

/////////////////////////////////////////////////////////////////////////

/**
 * [exports 获取用户的建筑信息协议]
 * @param  {[type]}   msg     [description]
 * @param  {[type]}   session [description]
 * @param  {Function} next    [description]
 * @return {[type]}           [description]
 */
module.exports = function (msg, session, next) {
    var uid = session.uid;
    if (!uid) {
        return next(null, {
            code: code.PARAM_ERROR
        });
    }

    var onDo = function* () {
        var build_model = yield thunkify(buildModel.getByUid)(uid);

        return next(null, {
            code: code.OK,
            result: {
                build_info: build_model.toJSON()
            }
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