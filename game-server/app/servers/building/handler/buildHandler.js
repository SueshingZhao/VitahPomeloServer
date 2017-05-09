'use strict';

var build = require('./build/build');
var getInfo = require('./build/getInfo');
var upgrade = require('./build/upgrade');
var refresh = require('./build/refresh');

/////////////////////////////////////////////////////////////////////////

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

/**
 * 建筑建造协议
 * @param  {[type]}   msg     [description]
 * @param  {[type]}   session [description]
 * @param  {Function} next    [description]
 * @return {[type]}           [description]
 */
Handler.prototype.build = function (msg, session, next) {
    build(msg, session, next);
};

/**
 * [upgrade 建筑升级协议]
 * @param  {[type]}   msg     [description]
 * @param  {[type]}   session [description]
 * @param  {Function} next    [description]
 * @return {[type]}           [description]
 */
Handler.prototype.upgrade = function (msg, session, next) {
    upgrade(msg, session, next);
};

/**
 * [refresh 刷新升级完成的建筑协议]
 * @param  {[type]}   msg     [description]
 * @param  {[type]}   session [description]
 * @param  {Function} next    [description]
 * @return {[type]}           [description]
 */
Handler.prototype.refresh = function (msg, session, next) {
    refresh(msg, session, next);
};

/**
 * [getInfo 获取用户的建筑信息]
 * @param  {[type]}   msg     [description]
 * @param  {[type]}   session [description]
 * @param  {Function} next    [description]
 * @return {[type]}           [description]
 */
Handler.prototype.getInfo = function (msg, session, next) {
    getInfo(msg, session, next);
};