'use strict';
var mongoose = require('mongoose');
var app = global.app;
var mock = require('../schema/mockset');
var project = require('../schema/project');
var util = require('../util');


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

function overflyData (res,data) {
    var _write = res.write;
    let body = [];
    res.write  = function (buf) {
        body.push(buf);
    };
    var _end = res.end;
    res.end  = function () {
        var re = JSON.parse(body.join(""));
        // Object.assign(re, data);
        //深度覆盖
        util.extendResultData(re,data);
        _write.call(res,new Buffer(JSON.stringify(re)));
        _end.call(res);
    };
}

mockServer.returnFunc = function(req, res, next) {

    let url = decodeURI(req.baseUrl),
        typeList = mockSetList[req.method],
        hasUrl = false;
    if (url.indexOf("/api") == 0) {
        if (typeList != undefined && typeList[url] != undefined) {
            let result = JSON.parse(typeList[url].result);
            if (typeList[url].dataHandler == "over") {
                hasUrl = true;
                res.send(result);
            } else {
                overflyData(res,result);
            }
        } else if (mockRegExpList[req.method] != undefined) {
            var RegExpList = mockRegExpList[req.method];
            for (let n in RegExpList) {
                if (url.indexOf(n) != 0) {
                    continue;
                }
                for (var j = 0, length2 = RegExpList[n].length; j < length2; j++) {
                    let element = RegExpList[n][j];
                    if (new RegExp(element.regexp).test(url)) {
                        let result = JSON.parse(element.result);
                        if (element.dataHandler == "over") {
                            hasUrl = true;
                            res.send(result);
                        } else {
                            overflyData(res,result);
                        }
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
    let ProjectModel =  db.model('projectSet', project.ProjectSchema);


    app.get('/umock/project/list', (req, res, next) => {
        ProjectModel.find().exec((err, docs) => {
            res.send(R(docs));
        });
    });

    app.post('/umock/project', (req, res, next) => {
        let query = getProjectModel(req.body);
        var mongooseEntity = new ProjectModel(query);
        mongooseEntity.save(function(error, data) {
            if (error) {
                console.error(error);
                res.send(defaultError("保存失败"));
            } else {
                reInitProjects();
                res.send(R(data));
            }
        });
    });

    app.post('/umock/project/:id', (req, res, next) => {
        var conditions = {
            _id: req.params.id
        };
        var update = {
            $set: getProjectModel(req.body)
        };
        ProjectModel.update(conditions, update, function(error, data) {
            if (error) {
                res.send(defaultError("保存失败"));
            } else {
                reInitProjects();
                res.send(R(data));
            }
        });
    });

    app.delete('/umock/project/:id', (req, res, next) => {
        var conditions = {
            _id: req.params.id
        };
        ProjectModel.remove(conditions, function(error) {
            if (error) {
                res.send(defaultError("删除失败"));
            } else {
                reInitProjects();
                res.send(defaultResult);
            }
        });
    });

    let getProjectModel = (body) => {
        var data = {};
        if (body.name != undefined) data.name = body.name;
        if (body.desc != undefined) data.desc = body.desc;

        if (body.beginPath != undefined) data.beginPath = body.beginPath;
        if (body.proxy != undefined) data.proxy = body.proxy;
        data.modifyTime = new Date();
        return data;
    }

    function reInitProjects() {
        ProjectModel.find().exec((err, docs) => {
            var listO = {};
            docs.forEach((n, i)=>{
                if (listO[n.beginPath] == undefined) listO[n.beginPath] = {};
                listO[n.beginPath] = n.proxy;
            });
            mockServer.projects = listO;
        });
    }
    reInitProjects();


    app.get('/umock/list/:id', (req, res, next) => {
        MockModel.find({"menuId":req.params.id}).exec((err, docs) => {
            res.send(R(docs));
        });
    });

    app.post('/umock/mockset', (req, res, next) => {
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

    app.post('/umock/mockset/:id', (req, res, next) => {
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

    app.delete('/umock/mockset/:id', (req, res, next) => {
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
        if (body.dataHandler != undefined) data.dataHandler = body.dataHandler;
        if (body.menuId != undefined) data.menuId = body.menuId;

        data.modifyTime = new Date();
        return data;
    }
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
            docs = docs.filter(function(doc) {
                if (!doc.active) return doc.active;
                if (doc.isreg) {
                    doc.regexp = "^" + doc.url.replace(/:\w+/g, "\\w+") + "$";
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
