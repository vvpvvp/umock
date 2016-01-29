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

var mockSetList = {},
    mockRegExpList = [];

let mockServer = {};

mockServer.returnFunc = function(req, res, next) {
    let url = decodeURI(req.baseUrl),
        typeList = mockSetList[req.method],
        hasUrl = false;
    if (url.indexOf("/api") == 0) {
        if (typeList != undefined && typeList[url] != undefined) {
            hasUrl = true;
            res.send(JSON.parse(typeList[url].result));
        } else if (mockRegExpList[req.method] != undefined) {
            var RegExpList = mockRegExpList[req.method];
            for(let n in RegExpList) {
                if(url.indexOf(n)!=0){
                    continue;
                }
                for(var j = 0, length2 = RegExpList[n].length; j < length2; j++){
                    let element = RegExpList[n][j];
                    if (new RegExp(element.regexp).test(url)) {
                        hasUrl = true;
                        res.send(JSON.parse(element.result));
                        break;
                    }
                }
            }
        }
    }
    if (!hasUrl) {
        next();
    }
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

    let getModel = (body) => {
        var data = {};
        if (body.url != undefined) {
            data.url = body.url;
            data.isreg = data.url.includes(":");
        }
        if (body.result != undefined) data.result = body.result;
        if (body.desc != undefined) data.desc = body.desc;
        if (body.active != undefined) data.active = body.active;
        if (body.type != undefined) data.type = body.type;
        if (body.param != undefined) data.param = body.param;
        if (body.respParam != undefined) data.respParam = body.respParam;
        
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

    function toObject(list) {
        var listO = {};
        list.forEach(function(n, i) {
            if (listO[n.type] == undefined) listO[n.type] = {};
            listO[n.type][n.url] = n;
        });
        return listO;
    }

    function toObjectList(list) {
        var listO = {};
        list.forEach(function(n, i) {
            if (listO[n.type] == undefined) listO[n.type] = [];
            if (listO[n.type][n.fromUrl] == undefined) listO[n.type][n.fromUrl] = [];
            listO[n.type][n.fromUrl].push(n);
        });
        return listO;
    }

    function reInitList() {
        MockModel.find().exec((err, docs) => {
            var regDocs = [];
            docs = docs.filter(function(doc){
                if (!doc.active) return doc.active;
                if (doc.isreg) {
                    doc.regexp = "^"+doc.url.replace(/:\w+/g, "\\w+")+"$";
                    doc.fromUrl = doc.url.match(/^(\/\w+)+/)[0];
                    regDocs.push(doc);
                }
                return true;
            });
            mockSetList = toObject(docs);
            mockRegExpList = toObjectList(regDocs);
        });
    }

    reInitList();
}

module.exports = mockServer;
