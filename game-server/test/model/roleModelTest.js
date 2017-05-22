'use strict';

var assert = require('assert');
var should = require('should');
var roleModel = require('../../app/models/roleModel.js');
var config = require('../config.js');

//////////////////////////////////////////////////////////////////

suite('测试 roleModel', function() {
	var role_model;

	setup(function(done) {
		roleModel.getByUid(config.uid, function(err, model) {
			if (!!model) {
				role_model = model;
				return done();
			}
		});
	});

	suite('getUid', function() {
		test('获取用户ID', function() {
			role_model.getUid().should.equal(config.uid);
		});
	});
});
