/**
 * Created by an.han on 15/7/20.
 */

var express = require('express');
var fs = require('fs');
var path = require('path');
var util = require('./util');
var httpProxy = require('http-proxy');
var mockServer = require('./views/router');
var proxy = httpProxy.createProxyServer();
var app = global.app;

// log proxy data
proxy.on('open', function(proxySocket) {
    proxySocket.on('data', function(chunk) {
        console.log(chunk.toString());
    });
});
proxy.on('proxyRes', function(proxyRes, req, res) {
    console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
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
        return imitator;
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

// 把基于 Imitatorfile 的相对绝对转成绝对路径
function parsePath(value) {
    return path.resolve(global.imitatorFilePath, value);
}


/**
 * 数据模拟函数
 */
function imitator() {
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
imitator.base = function(config) {
    process.nextTick(function() {
        app.use(function(req, res) {
            proxy.web(req, res, config);
        });
    });
}

// 读取文件内容
imitator.file = function(file) {
    return fs.readFileSync(parsePath(file));
}

// 设置静态文件路径
imitator.static = function(url, dir) {
    app.use(url, express.static(dir));
}

imitator.jsonp = function(context, callbackName) {
    callbackName = callbackName || 'callback';
    context = typeof context === 'string' ? context : JSON.stringify(context);
    return callbackName + '(' + context + ')';
};

imitator.init = function(argument) {
    imitator({
        url: '*', // 匹配的url
        result: mockServer.returnFunc // 返回的内容
    });

    mockServer.initLocalServer(imitator);
    app.use("/umock",express.static(path.join(__dirname, "../page")));
    const config = global.config;
    imitator.base({
        target: config.proxy,
        toProxy: true,
        changeOrigin: true
    });

};


module.exports = imitator;