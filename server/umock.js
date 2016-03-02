/**
 * Created by an.han on 15/7/20.
 */
'use strict';
var express = require('express');
var fs = require('fs');
var path = require('path');
var util = require('./utils/util');
var httpProxy = require('http-proxy');
var mockServer = require('./views/router');

var connect = require('connect');
var bodyParser = require('body-parser');
var proxy = httpProxy.createProxyServer();
var app = global.app;

// log proxy data
proxy.on('open', function(proxySocket) {
    console.log("open")
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
    if(req.method=="POST"&&req.body){
        proxyReq.write(req.body);
        proxyReq.end();
    }
});

proxy.on('proxyRes', function(proxyRes, req, res) {
    // console.log("proxyRes");
    // console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});


proxy.on('error', function(e, req, res) {
    // console.log(arguments);
});




// 根据参数个数获取配置
function getOption(arg) {
    var len = arg.length;
    // 默认配置
    var option = {
        headers: {
            'Cache-Control': 'no-cache'
        },
        statusCode: 200,
        cookies: [],
        timeout: 0
    };
    if (len === 0) {
        return umock;
    } else if (len === 1) {
        var newOption = arg[0];
        if (util.isObject(newOption)) {
            util.each(newOption, function(value, key) {
                if (key === 'headers') {
                    util.each(newOption.headers, function(headervalue, headerkey) {
                        option.headers[headerkey] = newOption.headers[headerkey];
                    })
                } else {
                    option[key] = newOption[key];
                }
            });
        }
    } else {
        option.url = arg[0];
        option.result = arg[1];
    }
    return option;
}

// 把基于 umockfile 的相对绝对转成绝对路径
function parsePath(value) {
    return path.resolve(global.umockFilePath, value);
}


/**
 * 数据模拟函数
 */
function umock() {
    var option = getOption(arguments);

    if (!option.url || !option.result) {
        return;
    }

    app.use(option.url, function(req, res, next) {
        setTimeout(function() {

            // set header
            res.set(option.headers);

            // set Content-Type
            option.type && res.type(option.type);

            // set status code
            res.status(option.statusCode);

            // set cookie
            util.each(option.cookies, function(item, index) {
                var name = item.name;
                var value = item.value;
                delete item.name;
                delete item.value;
                res.cookie(name, value, item);
            });

            // do result
            if (util.isFunction(option.result)) {
                option.result(req, res, next);
            } else if (util.isArray(option.result) || util.isObject(option.result)) {
                !option.type && res.type('json');
                res.json(option.result);
            } else {
                !option.type && res.type('text');
                res.send(option.result.toString());
            }

        }, option.timeout);
    });
}

// 规则之外的请求转发
umock.base = function() {}

// 读取文件内容
umock.file = function(file) {
    return fs.readFileSync(parsePath(file));
}

// 设置静态文件路径
umock.static = function(url, dir) {
    app.use(url, express.static(dir));
}


var restreamer = function() {
    return function(req, res, next) { //restreame
        req.removeAllListeners('data');
        req.removeAllListeners('end');
        next();
        process.nextTick(function() {
            console.log(1);
            if (req.body) {
                req.emit('data', JSON.stringify(req.body));
            }
            req.emit('end');
        })
    }
}

umock.init = function(argument) {

    app.use("/umock", express.static(path.join(__dirname, "../page/dist")));

    umock({
        url: '*', // 匹配的url
        result: mockServer.returnFunc // 返回的内容
    });

    mockServer.initLocalServer(umock);

    // app.use(bodyParser.urlencoded({extended: false, type: 'application/x-www-form-urlencoded'}));
    // app.use(restreamer());

    process.nextTick(function() {
        // app.use(bodyParser.json()) //json
        //     .use(restreamer()) //restreame
        //     .use(function(req, res) {
        //         // modify body here,
        //         // eg: req.body = {a: 1}.
        //         console.log('proxy body:',req.body);
        //         var author = req.headers.author;
        //         let beginPath = req.url.match(/\/\w+/)[0];
        //         //如果有author的header，做特殊处理。
        //         if (author) {
        //             beginPath = "/" + author;
        //             delete req.headers.author;
        //         }
        //         if (mockServer.projects[beginPath]) {
        //             // console.log(req.body);
        //             // var buffer = JSON.stringify(req.body);
        //             proxy.web(req, res, {
        //                 target: mockServer.projects[beginPath],
        //                 toProxy: true,
        //                 changeOrigin: true
        //             });
        //         } else {
        //             next();
        //         }
        //     });
        app.use(function(req, res, next) {

            var author = req.headers.author;
            let beginPath = req.url.match(/\/\w+/)[0];
            //如果有author的header，做特殊处理。
            if (author) {
                beginPath = "/" + author;
                delete req.headers.author;
            }
            if (mockServer.projects[beginPath]) {
                // console.log(req.body);
                // var buffer = JSON.stringify(req.body);
                // console.log(req.body);
                var headers = {};
                if(req.method=="POST"&&req.body){
                    var data = JSON.stringify(req.body);
                    req.body = data;
                    headers = {  
                        "Content-Type": 'application/json',  
                        "Content-Length": data.length
                    }
                }
                proxy.web(req, res, {
                    target: mockServer.projects[beginPath],
                    toProxy: true,
                    changeOrigin: true, 
                    headers:headers
                });
            } else {
                next();
            }
        });
    });

};


module.exports = umock;
