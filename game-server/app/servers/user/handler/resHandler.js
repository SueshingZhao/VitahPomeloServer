'use strict';

var co = require('co');
var thunkify = require('thunkify');
var code = require('../../../consts/code.js');
var PlayerManager = require('../../../lib/playerManager');

/////////////////////////////////////////////////////////////////

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

/**
 * [add 增加资源协议]
 * @param {[type]}   msg     [description]
 * @param {[type]}   session [description]
 * @param {Function} next    [description]
 */
Handler.prototype.add = function (msg, session, next) {
    var uid = session.uid;
    var gold = msg.gold || 0;
    var diamond = msg.diamond || 0;

    if (!uid) {
        return next(null, {
            code: code.PARAM_ERROR
        });
    }

    var onDo = function* () {
        var player = new PlayerManager(uid);
        yield thunkify(player.loadModel).call(player, ['role']);

        player.role.addGold(gold);
        player.role.addDiamond(diamond);

        // 数据库保存
        yield thunkify(player.save).call(player);
        player.pushModify();

        return next(null, {
            code: code.OK
        });
    };

    var onError = function (err) {
        console.error(err);
        return next(null, {
            code: code.FAIL
        });
    };

    co(onDo).catch(onError);
};