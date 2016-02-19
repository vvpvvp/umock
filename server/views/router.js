'use strict';
var mongoose = require('mongoose');
var app = global.app;
var util = require('../utils/util');
var mocksetView = require("./mockset");
var projectView = require("./project");

let mockServer = {};

mockServer.mockSetList = {};
mockServer.mockRegExpList = [];


function overflyData (req,res,data) {
    var _write = res.write;
    let body = [],isError = false;
    res.write  = function (buf) {
        body.push(buf);
    };
    var _end = res.end;
    res.end  = function () {
        if(res.statusCode==200){
            var re = JSON.parse(body.join(""));
            //深度覆盖
            util.extendResultData(re,data);
            // console.log("rewrite");
            _write.call(res,JSON.stringify(re));
        }
        _end.call(res);
    };
}

mockServer.returnFunc = function(req, res, next) {

    let url = decodeURI(req.baseUrl),
        typeList = mockServer.mockSetList[req.method],
        hasUrl = false;
        //如果有author的header，做特殊处理。
        var author = req.headers.author;
        if(author){
            url = "/" + author + url;
        }
        if (typeList != undefined && typeList[url] != undefined) {
            let result = JSON.parse(typeList[url].result);
            if (typeList[url].dataHandler == "over") {
                hasUrl = true;
                res.json(result);
                res.end();
            } else {
                overflyData(req,res,result);
            }
        } else if (mockServer.mockRegExpList[req.method] != undefined) {
            var RegExpList = mockServer.mockRegExpList[req.method];
            for (let n in RegExpList) {
                //识别前缀
                if (url.indexOf(n) != 0) {
                    continue;
                }else{
                    for (var j = 0, length2 = RegExpList[n].length; j < length2; j++) {
                        let element = RegExpList[n][j];
                        if (new RegExp(element.regexp).test(url)) {
                            let result = JSON.parse(element.result);
                            if (element.dataHandler == "over") {
                                hasUrl = true;
                                // res.write(JSON.stringify(result));
                                res.json(result);
                                res.end();
                            } else {
                                overflyData(req,res,result);
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }

    if (!hasUrl) {
        next();
    }
}

mockServer.initLocalServer = function() {

    const config = global.config;
    if(config['mongo']){
        let db = mongoose.createConnection(config['mongo']['uri']);
        // 链接错误
        db.on('error', function(error) {
            console.log(error);
        });

        mocksetView(mockServer,db);
        projectView(mockServer,db);
    }else{
        mocksetView(mockServer);
        projectView(mockServer);
    }
}

module.exports = mockServer;
