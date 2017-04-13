'use strict';

var co = require('co');
var thunkify = require('thunkify');
var pomelo = require('pomelo');
var code = require('../../../consts/code.js');

/////////////////////////////////////////////////////////////////////

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
	var self = this;
	var uid = msg.uid;
	if (!uid) {
		return next(null, {
			code: code.PARAM_ERROR
		});
	}

	var onDo = function*() {
		// 踢掉用户
		yield thunkify(pomelo.app.get('sessionService').kick)(uid);

		// session绑定uid
		yield thunkify(session.bind).bind(session)(uid);

		// 连接断开时的处理
		session.on('closed', onUserLeave.bind(self, self.app));

		// session同步，在改变session之后需要同步，以后的请求处理中就可以获取最新session
		yield thunkify(session.pushAll).bind(session)();

		return next(null, {
			code: code.OK
		});
	};

	var onError = function(err) {
		console.error(err);
		return next(null, {
			code: code.FAIL
		});
	};

	co(onDo).catch(onError);
};

// 断线之后的处理
var onUserLeave = function(app, session) {
	if (!session || !session.uid) {
		return;
	}

	console.log(session.uid + ' 断线');
};
