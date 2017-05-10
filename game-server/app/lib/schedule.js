'use strict';

var schedule = require('pomelo-schedule');
var userAddDiamond = require('./schedule/userAddDiamond');

////////////////////////////////////////////////////////////////////

schedule.scheduleJob(
    '0 0/1 * * * *',
    userAddDiamond, {
        name: 'addDiamond'
    }
);