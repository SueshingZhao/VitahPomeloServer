'use strict';

module.exports.getByUid = function (model, uid, cb) {
    // 创建成功后
    function afterCreate(err, schema) {
        cb(err, schema);
    }

    // 查询成功后
    function afterFindOne(err, schema) {
        if (!!err) {
            return cb(err);
        }
        if (!!schema) {
            return cb(null, schema);
        } else {
            // 如果没有对应表，则创建
            model.create({
                uid: uid
            }, afterCreate);
        }
    }

    model.findOne({
        uid: uid
    }, afterFindOne);
};