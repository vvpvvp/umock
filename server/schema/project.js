'use strict';
var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    name:"",
    desc:"",
    beginPath:"",
    proxy:"",
    isPublic:{type:Number,default:1},
    createTime: {type:Date,default: Date.now},
    modifyTime: {type:Date,default: Date.now}
});

exports.ProjectSchema = ProjectSchema;