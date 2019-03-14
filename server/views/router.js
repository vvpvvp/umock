'use strict';
var app = global.app;
var util = require('../utils/util');
var mocksetView = require("./mockset");
var projectView = require("./project");
let baseApi = require("../baseApi");

let mockServer = {};

mockServer.mockSetList = {};
mockServer.mockRegExpList = [];
mockServer.projects = {};
mockServer.projectIds = {};


function overflyData(req, res, data) {
  var _write = res.write;
  let body = [],
    isError = false;
  res.write = function (buf) {
    body.push(buf);
  };
  var _end = res.end;
  res.end = function () {
    if (res.get('Content-Type').indexOf('application/json') > -1) {
      try {
        var re = JSON.parse(body.join(""));
        //深度覆盖
        util.extendResultData(re, data);
        re = JSON.stringify(re);
        _write.call(res, re);
      } catch (error) {
        _write.call(res, body.join(""));
      }
    } else {
      _write.call(res, body.join(""));
    }
    _end.call(res);
  };
}

function handlerResult(req, res, element) {
  let result = {};
  try {
    result = JSON.parse(element.result);
  } catch (error) {
    console.error(error)
  }
  if (element.dataHandler == "over") {
    res.json(result);
    res.end();
    return true;
  } else {
    req.isMock = true;
    overflyData(req, res, result);
  }
  return false;
}

function getObj(obj, path) {
  var paths = path.split(".");
  while (paths.length > 0) {
    if (obj == undefined || obj[paths[0]] == undefined) {
      return undefined;
    }
    obj = obj[paths[0]];
    paths.shift();
  }
  return obj;
}

function getKey(req, key) {
  let uniqueKey = null;
  if (req.headers[key]) {
    uniqueKey = req.headers[key];
    delete req.headers[key];
  } else if (req.query[key]) {
    uniqueKey = req.query[key];
    req.query[key] = null;
  }
  return uniqueKey;
}

mockServer.returnFunc = function (req, res, next) {
  // console.log("comein");
  let url = decodeURI(req.baseUrl);
  let hasUrl = false;

  let projectKey = getKey(req, 'umock_project');
  let uniqueKey = getKey(req, 'umock_proxy');

  // console.log(projectKey)
  // console.log(uniqueKey)

  let project = mockServer.projects[projectKey];
  if (!project) {
    next();
    return;
  }
  let server = project.proxys[uniqueKey];
  let id = project.id || project._id;

  if(id && uniqueKey == project.proxy) {
    var mockset = getObj(mockServer.mockSetList, id + "." + req.method.toLowerCase() + "." + url);
    var regExpList = getObj(mockServer.mockRegExpList, id + "." + req.method.toLowerCase());
    if (mockset != undefined) {
      hasUrl = handlerResult(req, res, mockset);
    } else {
      if (regExpList != undefined) {
        for (var j = 0; j < regExpList.length; j++) {
          let element = regExpList[j];
          if (new RegExp(element.regexp).test(url)) {
            hasUrl = handlerResult(req, res, element);
            break;
          }
        }
      }
    }
  }
  if (server) {
    req.proxy = server.proxy;
    req.proxyServer = server;
  }

  if (!hasUrl) {
    next();
  }
}

mockServer.initLocalServer = function () {

  const config = global.config;
  let db = null;
  if (config['mongo']) {
    var mongoose = require('mongoose');
    db = mongoose.createConnection(config['mongo']['uri']);
    // 链接错误
    db.on('error', function (error) {
      console.log(error);
    });
  } else if (config['pouchdb']) {
    var pouchdb = require("pouchdb");
    db = new pouchdb("mocksets");
  } else if (config['mysql']) {
    var mysql = require("mysql");
    db = new mysql.createPool(config.mysql);
    baseApi();
  }
  if (db == null) {
    throw Error("无数据库配置");
  }
  mocksetView(mockServer, db);
  projectView(mockServer, db);

}

module.exports = mockServer;
