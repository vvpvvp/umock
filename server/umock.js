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

var proxy = httpProxy.createProxyServer();
var app = global.app;

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

// log proxy data
proxy.on('open', function(proxySocket) {
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
    console.log("proxyReq")
    if(req.isMock){
        res.setHeader('Transfer-Encoding', "chunked");
    }
    if ((req.method == "POST" || req.method == "PATCH") && req.body) {
        if(req.headers['content-type']&&req.headers['content-type'].indexOf("application/json")===0){
            var data = JSON.stringify(req.body);
            req.body = data;
            // if(req.headers['connection']=='keep-alive'){
            //     // proxyReq.setHeader('Content-Type', req.headers['content-type']);
            //     // proxyReq.setHeader('Content-Length', data.length);

            //     // proxyReq.setHeader('Connection', "keep-alive");
            // }
            proxyReq.write(req.body);
            proxyReq.end();
        }
    }
});

proxy.on('proxyRes', function(proxyRes, req, res) {
    if(req.isMock){
        delete proxyRes.headers["content-length"];
    }
});


proxy.on('end', function(proxyRes, req, res) {
    console.log("end");
});

proxy.on('error', function(e, req, res) {
    res.json({_status:500,_msg:"反向代理错误"});
    res.end();
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

umock.init = function(argument) {

    app.get("/", function(req, res) {
        res.redirect('/umock')
    });

    app.use("/umock", express.static(path.join(__dirname, "../page/dist")));

    umock({
        url: '*', // 匹配的url
        result: mockServer.returnFunc // 返回的内容
    });

    mockServer.initLocalServer(umock);

    process.nextTick(function() {
        app.use(function(req, res, next) {
            if (req.proxy) {
                proxy.web(req, res, {
                    target: req.proxy,
                    toProxy: true,
                    changeOrigin: true
                });
            } else {
                next();
            }
        });
    });

};


module.exports = umock;