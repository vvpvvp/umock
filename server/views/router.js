'use strict';
var mongoose = require('mongoose');
var models = require('../schema/models');
var config = require("../schema/config");
var MockModel = models.MockModel;
var app = global.app;
const defaultError = config.defaultError;
const defaultResult = config.defaultResult;
const R = config.R;

var mockSetList = [];

let mockServer = {};

mockServer.returnFunc = function (req, res, next) {
    var url = req.baseUrl;
    if(mockSetList[url]!=undefined){
        res.send(JSON.parse(mockSetList[url].result));
    }else{
        next();
    }
    // next();
}

mockServer.initLocalServer = function (imitator) {
    app.get('/server/list', (req, res, next) => {
        MockModel.find().exec((err, docs) => {
            res.send(R(docs));
        });
    });

    app.post('/server', (req, res, next) => {
        let query = {url: req.body.url, result: req.body.result};
        var mongooseEntity = new MockModel(query);
        mongooseEntity.save(function(error,data) {
            if(error) {
                res.send(defaultError("保存失败"));
            } else {
                reInitList();
                res.send(R(data));
            }
            // 关闭数据库链接
            // db.close();
        });
    });

    app.post('/server/:id', (req, res, next) => {
        var conditions = {_id:req.params.id};
        var update     = {$set :{url: req.body.url, result: req.body.result,modifyTime:new Date()}};
        MockModel.update(conditions, update, function(error,data){
            if(error) {
                res.send(defaultError("保存失败"));
            } else {
                reInitList();
                res.send(R(data));
            }
        });
    });

    app.delete('/server/:id', (req, res, next) => {
        var conditions = {_id:req.params.id};
        MockModel.remove(conditions, function(error){
            if(error) {
                res.send(defaultError("删除失败"));
            } else {
                reInitList();
                res.send(defaultResult);
            }
        });
    });

    function toObject(list,idName,hasNum){
        hasNum = hasNum===undefined?false:hasNum;
        idName = idName===undefined?"id":idName;
        var listO = {};
        list.forEach(function(n, i) {
            listO[n[idName]] = n;
            if (hasNum) {
                listO[n[idName]].count = i;
            }
        });
        return listO;
    }

    function reInitList() {
        MockModel.find().exec((err, docs) => {
            mockSetList = toObject(docs,"url");
        });
    }

    reInitList();
}

module.exports = mockServer;