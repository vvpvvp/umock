'use strict';
var app = global.app;
var mock = require('../schema/mockset');
var Result = require("../utils/result");
var Util = require("../utils/util");
var PouchDB = require("pouchdb");
// require("pouchdb");

var mocksetView = function(mockServer, db) {
    var reInitList = function() {};



    function toObject(list) {
        var listO = {};
        list.forEach(function(n, i) {
            var pid = n.projectId;
            if (listO[pid] == undefined) listO[pid] = {};
            listO[pid][n.url] = n;
        });
        return listO;
    }

    function toObjectList(list) {
        var listO = {};
        list.forEach(function(n, i) {
            var pid = n.projectId;
            if (listO[pid] == undefined) listO[pid] = [];
            listO[pid].push(n);
        });
        return listO;
    }

    if (db) {

        reInitList = function() {
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
                mockServer.mockSetList = toObject(docs);
                mockServer.mockRegExpList = toObjectList(regDocs);
            });
        };

        let MockModel = db.model('mockSet', mock.MockSetSchema);

        app.get('/umock/list/:id', (req, res, next) => {
            MockModel.find({
                "projectId": req.params.id
            }).exec((err, docs) => {
                res.send(Result.R(docs));
            });
        });

        app.post('/umock/mockset', (req, res, next) => {
            let query = getModel(req.body);
            var mongooseEntity = new MockModel(query);
            mongooseEntity.save(function(error, data) {
                if (error) {
                    res.send(Result.defaultError("保存失败"));
                } else {
                    reInitList();
                    res.send(Result.R(data));
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
                    res.send(Result.defaultError("保存失败"));
                } else {
                    reInitList();
                    res.send(Result.R(data));
                }
            });
        });

        app.delete('/umock/mockset/:id', (req, res, next) => {
            var conditions = {
                _id: req.params.id
            };
            MockModel.remove(conditions, function(error) {
                if (error) {
                    res.send(Result.defaultError("删除失败"));
                } else {
                    reInitList();
                    res.send(Result.defaultResult);
                }
            });
        });


    } else {
        var db = new PouchDB("mocksets");

        // db.destroy().then(function(resp) {
        //     db = PouchDB("mocksets");
        // });

        app.get('/umock/list/:id', (req, res, next) => {

            db.query(function(doc, emit) {
                if (doc.projectId === req.params.id) {
                    emit(doc);
                }
            }).then(function(result) {
                let mockSets = [];
                if (result.total_rows > 0) {
                    mockSets = result.rows.map(function(item) {
                        return item.key;
                    });
                }
                res.send(Result.R(mockSets));
            }).catch(function(err) {
                console.log(err);
            });
        });

        app.post('/umock/mockset', (req, res, next) => {
            let query = getModel(req.body);
            db.post(query).then(function(response) {
                reInitList();
                res.send(Result.R(Util.extend(query, formatResp(response))));
            }).catch(function(err) {
                console.log(err);
            });
        });

        app.post('/umock/mockset/:id', (req, res, next) => {
            db.get(req.params.id).then(function(doc) {
                var newData = Util.extend(getModel(req.body), {
                    _id: doc._id,
                    _rev: doc._rev
                });
                return db.put(newData);
            }).then(function(response) {
                reInitList();
                res.send(Result.R(response));
            }).catch(function(err) {
                console.log(err);
            });

        });

        app.delete('/umock/mockset/:id', (req, res, next) => {
            db.get(req.params.id).then(function(doc) {
                return db.remove(doc);
            }).then(function(result) {
                reInitList();
                res.send(Result.defaultResult);
            }).catch(function(err) {
                res.send(Result.defaultError("删除失败"));
            });
        });

        reInitList = function() {
            db.allDocs({
                include_docs: true
            }).then(function(docs) {
                var regDocs = [];
                docs = docs.rows.map(function(item) {
                    return item.doc;
                }).filter(function(doc) {
                    if (!doc.active) return doc.active;
                    if (doc.isreg) {
                        doc.regexp = "^" + doc.url.replace(/:\w+/g, "\\w+") + "$";
                        doc.fromUrl = doc.url.match(/^(\/\w+)+/)[0];
                        regDocs.push(doc);
                    }
                    return true;
                });
                mockServer.mockSetList = toObject(docs);
                mockServer.mockRegExpList = toObjectList(regDocs);
            }).catch(function(err) {
                console.log(err);
            });
        }

    }

    let formatResp = (resp) => {
        var data = resp;
        if (data.id != undefined) data._id = data.id;
        if (data.rev != undefined) data._rev = data.rev;
        return data;
    };

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
        if (body.projectId != undefined) data.projectId = body.projectId;

        data.modifyTime = new Date();
        return data;
    }

    reInitList();
}

module.exports = mocksetView;