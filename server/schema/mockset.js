'use strict';
var mongoose = require('mongoose');

var MockSetSchema = new mongoose.Schema({
    url: String,
    result: String,
    createTime: {type:Date,default: Date.now},
    modifyTime: {type:Date,default: Date.now}
});

exports.MockSetSchema = MockSetSchema;