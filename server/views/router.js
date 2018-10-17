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
    res.write = function(buf) {
        body.push(buf);
    };
    var _end = res.end;
    res.end = function() {
        if (res.statusCode == 200) {
            var re = JSON.parse(body.join(""));
            //深度覆盖
            util.extendResultData(re, data);
            re = JSON.stringify(re);
            _write.call(res, re);
        }
        _end.call(res);
    };
}

function handlerResult(req, res, element) {
    let result = JSON.parse(element.result);
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

function getObj(obj,path){
    var paths = path.split(".");
    while(paths.length>0){
        if(obj == undefined || obj[paths[0]]==undefined){
            return undefined;
        }
        obj = obj[paths[0]];
        paths.shift();
    }
    return obj;
}

mockServer.returnFunc = function(req, res, next) {
    // console.log("comein");
    let url = decodeURI(req.baseUrl),
        hasUrl = false;

    let uniqueKey = (url.match(/\/\w+/) || [""])[0];

    var author = req.headers.author;
    if (author) {
        uniqueKey = author;
        delete req.headers.author;
    } else if (req.headers._umock) {
        uniqueKey = req.headers._umock;
        delete req.headers._umock;
    } else if (req.query._umock) {
        uniqueKey = req.query._umock;
        req.query._umock = null;
    }
    var server = mockServer.projects[uniqueKey];
    if(!server){
        next();
        return;
    }
    let id = server.id||server._id;
    if (server) {
        req.proxy = server.proxy;
        req.proxyServer = server;
        var mockset = getObj(mockServer.mockSetList,id+"."+req.method+"."+url);
        var regExpList = getObj(mockServer.mockRegExpList,id+"."+req.method);
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

    if (!hasUrl) {
        next();
    }
}

mockServer.initLocalServer = function() {

    const config = global.config;
    let db = null;
    if (config['mongo']) {
        var mongoose = require('mongoose');
        db = mongoose.createConnection(config['mongo']['uri']);
        // 链接错误
        db.on('error', function(error) {
            console.log(error);
        });
    } else if(config['pouchdb']){
        var pouchdb = require("pouchdb");
        db = new pouchdb("mocksets");
    }else if(config['mysql']){
        var mysql = require("mysql");
        db = new mysql.createPool(config.mysql);
        baseApi();
    }
    if(db==null){
        throw Error("无数据库配置");
    }
    mocksetView(mockServer, db);
    projectView(mockServer, db);

}

module.exports = mockServer;