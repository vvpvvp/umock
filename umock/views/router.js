'use strict';
var mongoose = require('mongoose');
var app = global.app;
var mock = require('../schema/mockset');


const defaultResult = {
        result: "ok"
    },
    defaultError = function(messge) {
        return {
            result: "error",
            content: messge || ""
        }
    },
    R = function(messge) {
        return {
            result: "ok",
            content: messge || ""
        }
    };

var mockSetList = {};

let mockServer = {};

mockServer.returnFunc = function(req, res, next) {
    var url = decodeURI(req.baseUrl);
    if (mockSetList[url] != undefined) {
        res.send(JSON.parse(mockSetList[url].result));
    } else {
        next();
    }
    // next();
}

mockServer.initLocalServer = function() {

    const config = global.config;
    let db = mongoose.createConnection(config['mongo']['uri']);
    // 链接错误
    db.on('error', function(error) {
        console.log(error);
    });

    let MockModel = db.model('mockSet', mock.MockSetSchema);

    app.get('/umock/list', (req, res, next) => {
        MockModel.find().exec((err, docs) => {
            res.send(R(docs));
        });
    });

    app.post('/umock', (req, res, next) => {
        let query = getModel(req.body);
        var mongooseEntity = new MockModel(query);
        mongooseEntity.save(function(error, data) {
            if (error) {
                res.send(defaultError("保存失败"));
            } else {
                reInitList();
                res.send(R(data));
            }
            // 关闭数据库链接
            // db.close();
        });
    });

    app.post('/umock/:id', (req, res, next) => {
        var conditions = {
            _id: req.params.id
        };
        var update = {
            $set: getModel(req.body)
        };
        MockModel.update(conditions, update, function(error, data) {
            if (error) {
                res.send(defaultError("保存失败"));
            } else {
                reInitList();
                res.send(R(data));
            }
        });
    });

    let getModel = (body)=>{
        var data = {};
        if(body.url!=undefined)data.url = body.url;
        if(body.result!=undefined)data.result = body.result;
        if(body.desc!=undefined)data.desc = body.desc;
        if(body.active!=undefined)data.active = body.active;
        if(body.type!=undefined)data.type = body.type;
        if(body.param!=undefined)data.param = body.param;
        data.modifyTime = new Date();
        return data;
    }

    app.delete('/umock/:id', (req, res, next) => {
        var conditions = {
            _id: req.params.id
        };
        MockModel.remove(conditions, function(error) {
            if (error) {
                res.send(defaultError("删除失败"));
            } else {
                reInitList();
                res.send(defaultResult);
            }
        });
    });

    function toObject(list, idName, hasNum) {
        hasNum = hasNum === undefined ? false : hasNum;
        idName = idName === undefined ? "id" : idName;
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
            docs = docs.filter(function(obj){
                return obj.active;
            });
            mockSetList = toObject(docs, "url");
        });
    }

    reInitList();
}

module.exports = mockServer;