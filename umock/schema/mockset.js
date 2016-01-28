'use strict';
var mongoose = require('mongoose');

var MockSetSchema = new mongoose.Schema({
    url: String,
    desc: String,
    result: String,
    type: {type:String,default: "ALL"},
    param: String,
    active: {type:Boolean,default: true},
    createTime: {type:Date,default: Date.now},
    modifyTime: {type:Date,default: Date.now}
});

exports.MockSetSchema = MockSetSchema;