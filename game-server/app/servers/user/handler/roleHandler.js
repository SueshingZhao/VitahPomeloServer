'use strict';

var co = require('co');
var thunkify = require('thunkify');
var roleModel = require('../../../models/roleModel.js');
var code = require('../../../consts/code.js');

/////////////////////////////////////////////////////////////////

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

/**
 * [getInfo 获取用户基本信息协议]
 * @param  {[type]}   msg     [description]
 * @param  {[type]}   session [description]
 * @param  {Function} next    [description]
 * @return {[type]}           [description]
 */
Handler.prototype.getInfo = function (msg, session, next) {
    var uid = session.uid;
    if (!uid) {
        return next(null, {
            code: code.PARAM_ERROR
        });
    }

    var onDo = function* () {
        // 获取对应Uid的model
        var role_model = yield thunkify(roleModel.getByUid)(uid);

        return next(null, {
            code: code.OK,
            result: {
                role_info: role_model.toJSON()
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