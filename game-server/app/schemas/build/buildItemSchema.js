'use strict';

var _ = require('lodash');
var moment = require('moment');
var mongoose = require('mongoose');

///////////////////////////////////////////////////////

// 单个建筑信息
var buildItemSchema = new mongoose.Schema({
    // 建筑ID
    build_id: {
        type: Number,
        required: true
    },

    // 建筑类型
    type: {
        type: Number,
        required: true
    },

    // 建筑等级，默认0级
    lv: {
        type: Number,
        default: 0
    },

    // 建筑升级结束时间
    up_end_time: {
        type: Date,
        default: Date.now
    }
});

/**
 * [getId 获取建筑ID]
 * @return {[type]} [description]
 */
buildItemSchema.methods.getId = function () {
    return this.build_id;
};

/**
 * [getType 获取建筑类型]
 * @return {[type]} [description]
 */
buildItemSchema.methods.getType = function () {
    return this.type;
};

/**
 * [getLv 获取建筑等级]
 * @return {[type]} [description]
 */
buildItemSchema.methods.getLv = function () {
    return this.lv;
};

/**
 * [getUpEndTime 获取建筑升级结束时间]
 * @return {[type]} [description]
 */
buildItemSchema.methods.getUpEndTime = function () {
    return this.up_end_time;
};

/**
 * [getUpRemainTime 获取建筑升级的剩余时间]
 * @return {[type]} [description]
 */
buildItemSchema.methods.getUpRemainTime = function () {
    return moment.duration(this.up_end_time - moment()).asSeconds();
};

/**
 * [setUpEndTime 设置建筑升级结束时间]
 * @param {[type]} need_time [description]
 */
buildItemSchema.methods.setUpEndTime = function (need_time) {
    need_time = parseInt(need_time);
    need_time = _.max([need_time, 0]);
    this.up_end_time = moment().add(need_time, 's');
};

/**
 * [isUpgradeTimeUp 判断升级时间是否结束]
 * @return {Boolean} [description]
 */
buildItemSchema.methods.isUpgradeTimeUp = function () {
    if (moment() >= moment(this.up_end_time) && moment(this.up_end_time).unix() != moment(0).unix()) {
        return true;
    }

    return false;
};

/**
 * [isEndUpgrade 判断是否升级完成（加上5秒的误差时间）]
 * @return {Boolean} [description]
 */
buildItemSchema.methods.isEndUpgrade = function () {
    if (moment().add(5, 's') >= moment(this.up_end_time) && moment(this.up_end_time).unix() != moment(0).unix()) {
        return true;
    }

    return false;
};

// 升级该建筑
buildItemSchema.methods.upgrade = function () {
    this.lv++;
    this.up_end_time = 0;
    return true;
};

if (!buildItemSchema.options.toJSON) {
    buildItemSchema.options.toJSON = {};
}
buildItemSchema.options.toJSON.transform = function (doc, ret) {
    // 时间格式以时间戳形式下发
    ret.up_end_time = moment(ret.up_end_time).unix();
    delete ret._id;
};

module.exports = buildItemSchema;