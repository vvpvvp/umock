'use strict';
var app = global.app;
var Result = require("../utils/result");

var mocksetView = function (mockServer, db) {

  var reInitList = function () {};

  function toObject(list) {
    var listO = {};
    list.forEach(function (n, i) {
      var pid = n.projectId;
      if (listO[pid] == undefined) listO[pid] = {};
      if (listO[pid][n.type] == undefined) listO[pid][n.type] = {};
      listO[pid][n.type][n.url] = n;
    });
    return listO;
  }

  function toObjectList(list) {
    var listO = {};
    list.forEach(function (n, i) {
      var pid = n.projectId;
      if (listO[pid] == undefined) listO[pid] = {};
      if (listO[pid][n.type] == undefined) listO[pid][n.type] = [];
      listO[pid][n.type].push(n);
    });
    return listO;
  }

  let getOne = function (id, res) {
    db.query(`SELECT * from mockset where id = ${id}`, function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send(Result.defaultError("失败"));
        return;
      }
      res.send(Result.R(rows[0]));
    });
  }

  reInitList = function () {
    db.query(`select * from mockset`, function (err, docs, fields) {
      if (err) {
        console.log(err);
        return;
      }
      var regDocs = [];
      docs = docs.filter(function (doc) {
        if (!doc.active) return doc.active;
        if (doc.url.includes(":")) {
          doc.regexp = "^" + doc.url.replace(/:\w+/g, "\\w+") + "$";
          regDocs.push(doc);
        } else if (/\{\w+\}/.test(doc.url)) {
          doc.regexp = "^" + doc.url.replace(/\{\w+\}/g, "\\w+") + "$";
          regDocs.push(doc);
        }
        return true;
      });
      mockServer.mockSetList = toObject(docs);
      mockServer.mockRegExpList = toObjectList(regDocs);
    });
  };

  app.get('/umock/list/:id', (req, res, next) => {
    db.query(`SELECT * from mockset where projectId = ${req.params.id}`, function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send(Result.defaultError("失败"));
        return;
      }
      res.send(Result.R(rows));
    });
  });

  app.post('/umock/mockset', (req, res, next) => {
    let query = getModel(req.body);
    console.log(query);
    db.query(`INSERT INTO mockset SET ?`, query, function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send(Result.defaultError("保存失败"));
      } else {
        reInitList();
        getOne(rows.insertId, res);
      }
    });
  });

  app.post('/umock/mockset/updateActive/:id', (req, res, next) => {
    let query = getModel(req.body);
    db.query(`update mockset SET active = ? where id = ${req.params.id}`, [req.body.active], function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send(Result.defaultError("更新失败"));
      } else {
        reInitList();
        res.send(Result.R(rows));
      }
    });
  });

  app.post('/umock/mockset/:id', (req, res, next) => {
    let query = getModel(req.body);
    db.query(`update mockset SET ? where id = ${req.params.id}`, query, function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send(Result.defaultError("更新失败"));
      } else {
        reInitList();
        res.send(Result.R(rows));
      }
    });
  });

  app.delete('/umock/mockset/:id', (req, res, next) => {
    db.query(`delete from mockset where id = ${req.params.id}`, function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send(Result.defaultError("删除失败"));
      } else {
        reInitList();
        res.send(Result.R(rows));
      }
    });
  });

  //废弃
  app.post('/umock/mockset/:id/discard', (req, res, next) => {
    db.query(`update mockset set status = 3 where id = ${req.params.id}`, function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send(Result.defaultError("更新失败"));
      } else {
        reInitProjects();
        res.send(Result.R(rows));
      }
    });
  });

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
    }
    if (body.result != undefined) data.result = body.result;
    if (body.summary != undefined) data.summary = body.summary;
    if (body.description != undefined) data.description = body.description;
    if (body.active != undefined) data.active = body.active;
    if (body.type != undefined) data.type = body.type;
    if (body.dataHandler != undefined) data.dataHandler = body.dataHandler;
    if (body.tags != undefined) data.tags = body.tags;
    if (body.projectId != undefined) data.projectId = body.projectId;

    return data;
  }

  reInitList();
}

module.exports = mocksetView;
