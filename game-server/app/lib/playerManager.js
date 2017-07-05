'use strict';

var co = require('co');
var thunkify = require('thunkify');
var roleModel = require('../models/roleModel');
var buildModel = require('../models/buildModel');
var pushService = require('../services/pushService');

var model_file_list = {
    role: roleModel,
    build: buildModel
};

module.exports = function (uid) {
    this.uid = uid;
    this.old_json = {};
    this.no_change_model = {};
    this.model_name_list = [];
};

var Player = module.exports;

Player.prototype.getUid = function () {
    return this.uid;
};

Player.prototype.loadModel = function (name_list, cb) {
    var self = this;

    var onDo = function* () {
        for (var i = 0; i < name_list.length; i++) {
            var key = name_list[i];

            self.model_name_list.push(key);
            self[key] = yield thunkify(model_file_list[key].getByUid)(self.uid);
            self.old_json[key] = self[key].toJSON();
        }
        cb(null);
    };

    var onError = function (err) {
        console.error(err);
        cb(null);
    };

    co(onDo).catch(onError);
};

Player.prototype.save = function (cb) {
    var self = this;

    var onDo = function* () {
        for (var i = 0; i < self.model_name_list.length; i++) {
            var key = self.model_name_list[i];

            if (self.no_change_model[key]) {
                continue;
            }

            var model = self[key];
            if (!!model && !!model.isModified()) {
                yield model.save();
            }
        }
        cb(null);
    };

    var onError = function (err) {
        console.error(err);
        cb(null);
    };

    co(onDo).catch(onError);
};

Player.prototype.reset = function (name_list) {
    var self = this;
    for (var i = 0; i < name_list.length; i++) {
        var key = name_list[i];
        self.no_change_model[key] = 1;
    }
};

Player.prototype.pushModify = function () {
    var self = this;
    for (var i = 0; i < self.model_name_list.length; i++) {
        var key = self.model_name_list[i];
        if (self.no_change_model[key]) {
            continue;
        }

        switch (key) {
        case 'role':
            pushService.pushRoleModify(self.old_json[key], self[key].toJSON());
            break;
        case 'build':
            pushService.pushBuildModify(self.old_json[key], self[key].toJSON());
            break;
        }
    }
};