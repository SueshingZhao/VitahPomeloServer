'use strict';

var co = require('co');
var thunkify = require('thunkify');
var roleModel = require('../../models/roleModel');
var pushService = require('../../services/pushService');

///////////////////////////////////////////////////////////////////

module.exports = function () {
    var onDo = function* () {
        var role_model = yield thunkify(roleModel.getByUid)(10001);
        var role_old_json = role_model.toJSON();
        role_model.addDiamond(1);

        yield role_model.save();
        pushService.pushRoleModify(role_old_json, role_model.toJSON());
    };

    var onError = function (err) {
        console.error(err);
    };

    co(onDo).catch(onError);
};