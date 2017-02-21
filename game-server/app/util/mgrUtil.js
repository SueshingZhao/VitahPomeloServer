var pomelo = require('pomelo');

/**
 * 发送消息
 */
exports.sendGlobalMessage = function(event_type, params, channel_name, cb) {
	if (!!pomelo.app) {
		var globalChannelService = pomelo.app.get('globalChannelService');
		globalChannelService.pushMessage(
			'connector',
			event_type,
			params,
			channel_name, {
				isPush: true
			}, cb);
	} else {
		if (!!cb) {
			cb();
		}
	}
};

/**
 * 发送消息
 * @return {[type]} [description]
 */
exports.sendStatusMessage = function(uids, event_type, params, cb) {
	if (!!pomelo.app) {
		var statusService = pomelo.app.get('statusService');
		statusService.pushByUids(
			uids,
			event_type,
			params,
			cb);
	} else {
		if (!!cb) {
			cb();
		}
	}
};
