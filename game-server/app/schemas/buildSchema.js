'use strict';

var moment = require('moment');
var _ = require('lodash');
var mongoose = require('mongoose');
var buildItemSchema = require('./build/buildItemSchema');

////////////////////////////////////////////////////////////////////

var buildingSchema = new mongoose.Schema({
	// 用户id
	uid: {
		type: Number,
		required: true,
		unique: true,
		index: true
	},

	// 建筑列表
	build_list: [buildItemSchema],

	build_max_id: {
		type: Number,
		default: 10000
	}
});

/**
 * 建筑自增id
 * @return {[type]} [description]
 */
buildingSchema.methods.genBuildId = function() {
	this.build_max_id++;
	return this.build_max_id;
};

/**
 * 获取建筑
 * @param  {[type]} build_id [建筑id]
 * @return {[type]}          [description]
 */
buildingSchema.methods.getBuild = function(build_id) {
	return _.find(this.build_list, function(build) {
		return build.build_id == build_id;
	});
};

/**
 * 获取建筑列表
 * @return {[type]} [description]
 */
buildingSchema.methods.getBuildList = function() {
	return this.build_list;
};

/**
 * 添加建筑
 * @param {[type]} build_type [要添加的建筑类型]
 * @param {[type]} position   [建筑位置]
 * @param {[type]} rotation   [建筑旋转角度]
 */
buildingSchema.methods.addBuild = function(build_type) {
	var new_build_id = this.genBuildId();
	this.build_list.push({
		build_id: new_build_id,
		lv: 0,
		type: build_type
	});

	return new_build_id;
};

/**
 * 通过建筑类型获取该类型的所有建筑
 * @param  {[type]} build_type [description]
 * @return {[type]}            [description]
 */
buildingSchema.methods.getBuildListByType = function(build_type) {
	var build_list = [];
	_.each(this.build_list, function(build_item) {
		if (build_item.type == build_type) {
			build_list.push(build_item);
		}
	});
	return build_list;
};

if (!buildingSchema.options.toJSON) {
	buildingSchema.options.toJSON = {};
}
/* jshint unused:false */
buildingSchema.options.toJSON.transform = function(doc, ret) {
	delete ret.uid;
	delete ret.build_max_id;
	delete ret._id;
	delete ret.__v;
};

mongoose.model('Build', buildSchema);
