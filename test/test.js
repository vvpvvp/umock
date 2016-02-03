'use strict';

// let query = {url: req.body.url, result: req.body.result};
//         var mongooseEntity = new MockModel(query);
//         mongooseEntity.save(function(error) {
//             if(error) {
//                 console.log(defaultError("保存失败"));
//             } else {
//                 MockModel.find().exec((err, docs) => {
//                     mockSetList = docs;
//                 });
//                 res.send(defaultResult);
//             }
//             // 关闭数据库链接
//             // db.close();
//         });


// var models = require('../server/schema/models');
// var m = new models.MockModel({url: "/json1", result: "{test:1}"});
// console.log("saving");
// m.save(function(error) {
//     if(error) {
//         console.log(error);
//     } else {
//         console.log('saved OK!');
//     }
//     // 关闭数据库链接fromObj[0]
//     models.db.close();
// });

var util = require('../server/util');
var a = {
    "a": 1,
    "b": [{
        "b1": 2,
        "b2": 3
    },{
        "b1": 2,
        "b2": 3
    },{
        "b1": 2,
        "b2": 3
    }]
};

util.extendResultData(a,{
	"a": 2,
    "b": [{
        "b2": 5,
        "b3": 5
    }]
});

console.log(a);
