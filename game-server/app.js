var pomelo = require('pomelo');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'VitahPomeloServer');

// app configuration

// 原先配置

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

/*
app.configure('production|development', 'connector', function() {
	app.set('connectorConfig', {
		connector: pomelo.connectors.hybridconnector,
		heartbeat: 30
	});
});
*/

// start app
app.start();

process.on('uncaughtException', function(err) {
	console.error(' Caught exception: ' + err.stack);
});
