'use strict';
var mongoose = require('mongoose');
var config = require("./config");
var db = mongoose.createConnection(config['mongo']['uri']);
// 链接错误
db.on('error', function(error) {
    console.log(error);
});

var mock = require('../schema/mockset');

exports.MockModel = db.model('mockSet', mock.MockSetSchema);
exports.db = db;
