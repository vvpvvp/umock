'use strict';
var mongoose = require('mongoose');
var app = global.app;
var util = require('../utils/util');
var mocksetView = require("./mockset");
var projectView = require("./project");

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
            // console.log("rewrite");
            _write.call(res, JSON.stringify(re));
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
        overflyData(req, res, result);
    }
    return false;
}

mockServer.returnFunc = function(req, res, next) {

    let url = decodeURI(req.baseUrl),
        hasUrl = false;

    let beginPath = (url.match(/\/\w+/) || [""])[0];

    var author = req.headers.author;
    if (author) {
        beginPath = author;
        delete req.headers.author;
    }
    var server = mockServer.projects[beginPath];

    if (server) {
        req.proxy = server.proxy;
        var serverMockList = mockServer.mockSetList[server._id];
        if (serverMockList != undefined && serverMockList[url] != undefined) {
            hasUrl = handlerResult(req, res, serverMockList[url]);
        } else {
            if (mockServer.mockRegExpList[server._id] != undefined) {
                var RegExpList = mockServer.mockRegExpList[server._id];
                for (var j = 0; j < RegExpList.length; j++) {
                    let element = RegExpList[j];
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
    if (config['mongo']) {
        let db = mongoose.createConnection(config['mongo']['uri']);
        // 链接错误
        db.on('error', function(error) {
            console.log(error);
        });

        mocksetView(mockServer, db);
        projectView(mockServer, db);
    } else {
        mocksetView(mockServer);
        projectView(mockServer);
    }
}

module.exports = mockServer;