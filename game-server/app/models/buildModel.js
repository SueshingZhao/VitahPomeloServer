'use strict';

var buildSchema = require('../schemas/buildSchema');
var mongoose = require('mongoose');
var Build = mongoose.model('Build');
var modelUtil = require('../util/modelUtil');
var pushService = require('../services/pushService');
var _ = require('lodash');

//////////////////////////////////////////////////////////////////////////

/**
 * 根据用户的id获取建筑的信息表，不存在则创建表
 */
module.exports.getByUid = function(uid, cb) {
	modelUtil.getByUid(Build, uid, function(err, build_model) {
		if (!!err) {
			console.error(err);
			return cb(err);
		}

		dealSchedule(build_model, function(err) {
			if (build_model.isModified()) {
				build_model.save(function() {
					cb(null, build_model);
				});
			} else {
				cb(null, build_model);
			}
		});
	});
};

/**
 * 处理建筑中的排程
 * @param  {[type]}   build_model [description]
 * @param  {Function} cb          [description]
 * @return {[type]}               [description]
 */
var dealSchedule = function(build_model, cb) {
	var build_change = false;
	var build_old_json = build_model.toJSON();
	_.each(build_model.getBuildList(), function(build_item) {
		if (build_item.isUpgradeTimeUp()) {
			build_change = true;
			build_item.upgrade();
		}
	});

	var uid = build_model.uid;
	if (build_change) {
		pushService.pushBuildModify(uid, build_old_json, build_model.toJSON());
	}

	cb();
};
