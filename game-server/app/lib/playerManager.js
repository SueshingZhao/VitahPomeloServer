'use strict';

var _ = require('lodash');
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
    this.model_old_json = {};
    this.reset_model = [];
    this.model_name = [];
    this.modified_model = [];
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

            // 判断该model表名是否已经存在
            if (_.indexOf(self.model_name, key) == -1) {
                self.model_name.push(key);
            }

            // 判断该表是否已经存在
            if (!!self[key]) {
                continue;
            }

            // 获取表，并存储json数据
            self[key] = yield thunkify(model_file_list[key].getByUid)(self.uid);
            self.model_old_json[key] = self[key].toJSON();
        }

        cb(null);
    };

    var onError = function (err) {
        console.error(err);
        cb(null);
    };

    co(onDo).catch(onError);
};

Player.prototype.reloadModel = function (name_list, cb) {
    var self = this;

    var onDo = function* () {
        for (var i = 0; i < name_list.length; i++) {
            var key = name_list[i];

            if (_.indexOf(self.model_name_list, key) == -1) {
                self.model_name.push(key);
            }

            self[key] = yield thunkify(model_file_list[key].getByUid)(self.uid);
            self.model_old_json[key] = self[key].toJSON();
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
        self.reset_model.push(key);
    }
};

Player.prototype.save = function (cb) {
    var self = this;

    self.modified_model = [];
    var onDo = function* () {
        for (var i = 0; i < self.model_name.length; i++) {
            var key = self.model_name[i];

            if (_.indexOf(self.reset_model, key) != -1) {
                continue;
            }

            var model = self[key];
            if (!!model && !!model.isModified()) {
                self.modified_model.push(key);
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

Player.prototype.pushModify = function () {
    var self = this;
    for (var i = 0; i < self.model_name.length; i++) {
        var key = self.model_name[i];

        // 当表没有数据更新，则跳过
        // 注：之所以新建一个数组用于保存表名是因为调用save函数之后，isModified函数判断返回为false
        if (_.indexOf(self.modified_model, key) == -1) {
            continue;
        }

        if (!self[key] || !self.model_old_json[key]) {
            continue;
        }

        switch (key) {
        case 'role':
            pushService.pushRoleModify(self.model_old_json[key], self[key].toJSON());
            break;
        case 'build':
            pushService.pushBuildModify(self.model_old_json[key], self[key].toJSON());
            break;
        }
    }
};