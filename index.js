'use strict';
var imitator = require("imitator/imitator");
var mockServer = require("./server/views/router");
module.exports = function() {


    // 返回一个json
    imitator({
        url: '*',   // 匹配的url
        result: mockServer.returnFunc // 返回的内容
    });

    mockServer.initLocalServer(imitator);

    imitator.static("/server","./server/page");

    imitator.base({target: 'http://api.gongzuojihui.com',toProxy:true,changeOrigin:true});

    // 返回一个json
    // imitator({
    //     url: '/json1',   // 匹配的url
    //     result: mockServer.returnFunc // 返回的内容
    // });


}