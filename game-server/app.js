var pomelo = require('pomelo');
var mongoose = require('mongoose');
var configUtil = require('./app/util/configUtil.js');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'VitahPomeloServer');

// app configuration

app.configure('all', function() {
	// 载入mongodb数据库的配置
	var mongodb_config = configUtil.load('mongodb');

	// 使用mongoose连接mongodb
	var db = mongoose.connect(mongodb_config.host, mongodb_config.database, mongodb_config.port, mongodb_config.options).connection;

	// 当数据库连接失败和成功时的处理
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback() {
		console.log('数据库连接成功');
	});

	// 监控请求响应时间，如果超时就给出警告
	app.filter(pomelo.timeout());
});


// 原先配置
/*
app.configure('production|development', 'connector', function() {
	app.set('connectorConfig', {
		connector: pomelo.connectors.sioconnector,
		//websocket, htmlfile, xhr-polling, jsonp-polling, flashsocket
		transports: ['websocket'],
		heartbeats: true,
		closeTimeout: 60,
		heartbeatTimeout: 60,
		heartbeatInterval: 25
	});
});
*/


// 定义服务端和客户端的连接方式
app.configure('all', 'connector', function() {
	app.set('connectorConfig', {
		connector: pomelo.connectors.hybridconnector,
		heartbeat: 30
	});
});

// start app
app.start();

process.on('uncaughtException', function(err) {
	console.error(' Caught exception: ' + err.stack);
});
