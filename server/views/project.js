'use strict';
var app = global.app;
var Result = require("../utils/result");
var Util = require("../utils/util");
var urlencoded = require('body-parser').urlencoded({ limit: '50mb', extended: true });

var view = function (mockServer, db) {


  const config = global.config;
  var reInitProjects = function () {};

  let getOne = function (id, res) {
    db.query(`SELECT * from project where id = ${id}`, function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send(Result.defaultError("失败"));
        return;
      }
      res.send(Result.R(rows[0]));
    });
  }

  app.get('/umock/project/list', (req, res, next) => {

    db.query('SELECT * from project', function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send(Result.defaultError("失败"));
        return;
      }
      res.send(Result.R(rows));
    });
  });

  app.get('/umock/project/:id', (req, res, next) => {
    db.query(`SELECT * from project where id = ${req.params.id}`, function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send(Result.defaultError("失败"));
        return;
      }
      res.send(Result.R(rows.length == 0 ? null : rows[0]));
    });
  });

  app.post('/umock/project', (req, res, next) => {
    let query = getProjectModel(req.body);
    db.query(`INSERT INTO project SET ?`, query, function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send(Result.defaultError("保存失败"));
      } else {
        reInitProjects();
        getOne(rows.insertId, res);
      }
    });
  });

  app.post('/umock/project/:id', (req, res, next) => {
    let query = getProjectModel(req.body);
    db.query(`update project SET ? where id = ${req.params.id}`, query, function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send(Result.defaultError("更新失败"));
      } else {
        reInitProjects();
        res.send(Result.R(rows));
      }
    });
  });

  app.delete('/umock/project/:id', (req, res, next) => {
    db.query(`delete from project where id = ${req.params.id}`, function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.send(Result.defaultError("删除失败"));
      } else {
        reInitProjects();
        res.send(Result.R(rows));
      }
    });
  });

  reInitProjects = function () {
    db.query(`select * from project`, function (err, rows, fields) {
      if (err) {
        console.log(err);
        return;
      }
      var listO = {},
        listId = {};
      rows.forEach((n, i) => {
        // if (listO[n.uniqueKey] == undefined) listO[n.uniqueKey] = {};
        listO[n.uniqueKey] = n;
        listId[n.id] = n;
      });
      mockServer.projects = listO;
      mockServer.projectIds = listId;
    });
  };


  let formatResp = (resp) => {
    var data = resp;
    if (data.id != undefined) data._id = data.id;
    if (data.rev != undefined) data._rev = data.rev;
    return data;
  };

  let getProjectModel = (body) => {
    var data = {};
    if (body.name != undefined) data.name = body.name;
    if (body.description != undefined) data.description = body.description;
    if (body.rewritePath != undefined) data.rewritePath = body.rewritePath;
    if (body.identification != undefined) data.identification = body.identification;
    if (body.uniqueKey != undefined) data.uniqueKey = body.uniqueKey;
    if (body.swagger != undefined) data.swagger = body.swagger;
    if (body.private != undefined) data.private = body.private;
    if (body.proxy != undefined) data.proxy = body.proxy;
    return data;
  };

  reInitProjects();

}

module.exports = view;
