'use strict';
var app = global.app;
var project = require('../schema/project');
var Result = require("../utils/result");
var Util = require("../utils/util");
var PouchDB = require("pouchdb");

var view = function(mockServer, db) {


    var reInitProjects = function() {};
    if (db) {

        let ProjectModel = db.model('projectSet', project.ProjectSchema);

        app.get('/umock/project/list', (req, res, next) => {
            ProjectModel.find().exec((err, docs) => {
                res.send(Result.R(docs));
            });
        });

        app.get('/umock/project/:id', (req, res, next) => {
            ProjectModel.find({
                "_id": req.params.id
            }).exec((err, docs) => {
                res.send(Result.R(docs));
            });
        });

        app.post('/umock/project', (req, res, next) => {
            let query = getProjectModel(req.body);
            var mongooseEntity = new ProjectModel(query);
            mongooseEntity.save(function(error, data) {
                if (error) {
                    console.error(error);
                    res.send(Result.defaultError("保存失败"));
                } else {
                    reInitProjects();
                    res.send(Result.R(data));
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
                    res.send(Result.defaultError("保存失败"));
                } else {
                    reInitProjects();
                    res.send(Result.R(data));
                }
            });
        });

        app.delete('/umock/project/:id', (req, res, next) => {
            var conditions = {
                _id: req.params.id
            };
            ProjectModel.remove(conditions, function(error) {
                if (error) {
                    res.send(Result.defaultError("删除失败"));
                } else {
                    reInitProjects();
                    res.send(Result.defaultResult);
                }
            });
        });

        reInitProjects = function() {
            ProjectModel.find().exec((err, docs) => {
                var listO = {},
                    listId = {};
                docs.forEach((n, i) => {
                    // if (listO[n.beginPath] == undefined) listO[n.beginPath] = {};
                    listO[n.beginPath] = n;
                    listId[n._id] = n;
                });
                mockServer.projects = listO;
                mockServer.projectIds = listId;
            });
        };
    } else {

        var db = new PouchDB("projects");

        // db.destroy().then(function(resp) {
        //     db = PouchDB("projects");
        // });

        app.get('/umock/project/list', (req, res, next) => {
            db.allDocs({
                include_docs: true
            }).then(function(docs) {
                let projects = [];
                if (docs.total_rows > 0) {
                    projects = docs.rows.map(function(item) {
                        return item.doc;
                    });
                }
                res.send(Result.R(projects));
            }).catch(function(err) {
                console.log(err);
            });
        });

        app.get('/umock/project/:id', (req, res, next) => {
            db.get(req.params.id).then(function(response) {
                res.send(Result.R([response]));
            });
        });

        app.post('/umock/project', (req, res, next) => {
            let query = getProjectModel(req.body);
            db.post(query).then(function(response) {
                reInitProjects();
                res.send(Result.R(Util.extend(query, formatResp(response))));
            }).catch(function(err) {
                console.log(err);
            });
        });

        app.post('/umock/project/:id', (req, res, next) => {
            db.get(req.params.id).then(function(doc) {
                var newData = Util.extend(getProjectModel(req.body), {
                    _id: doc._id,
                    _rev: doc._rev
                });
                return db.put(newData);
            }).then(function(docs) {
                reInitProjects();
                let projects = [];
                if (docs.total_rows > 0) {
                    projects = docs.rows.map(function(item) {
                        return item.doc;
                    });
                }
                res.send(Result.R(projects));
            }).catch(function(err) {
                console.log(err);
            });
        });


        app.delete('/umock/project/:id', (req, res, next) => {
            db.get(req.params.id).then(function(doc) {
                return db.remove(doc);
            }).then(function(response) {
                res.send(Result.defaultResult);
            })
        });

        reInitProjects = function() {
            db.allDocs({
                include_docs: true
            }).then(function(docs) {
                var listO = {},
                    listId = {};
                docs.rows.forEach((n, i) => {
                    // if (listO[n.beginPath] == undefined) listO[n.beginPath] = {};
                    listO[n.doc.beginPath] = n.doc;
                    listId[n.doc._id] = n.doc;
                });
                mockServer.projects = listO;
                mockServer.projectIds = listId;
            });
        };
    }

    let formatResp = (resp) => {
        var data = resp;
        if (data.id != undefined) data._id = data.id;
        if (data.rev != undefined) data._rev = data.rev;
        return data;
    };

    let getProjectModel = (body) => {
        var data = {};
        if (body.name != undefined) data.name = body.name;
        if (body.desc != undefined) data.desc = body.desc;
        if (body.isPublic != undefined) data.isPublic = body.isPublic;
        if (body.beginPath != undefined) data.beginPath = body.beginPath;
        if (body.proxy != undefined) data.proxy = body.proxy;
        data.modifyTime = new Date();
        return data;
    };

    reInitProjects();

}

module.exports = view;