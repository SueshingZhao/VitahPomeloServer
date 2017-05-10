'use strict';

var schedule = require('pomelo-schedule');
var userAddRes = require('./schedule/userAddRes');

////////////////////////////////////////////////////////////////////

schedule.scheduleJob(
    '0 0/1 * * * *',
    userAddRes, {
        name: 'addDiamond'
    }
);