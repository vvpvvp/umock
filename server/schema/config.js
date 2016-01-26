'use strict';
var env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const config = {
    'development': {
        'env': 'development',
        'redis': {
            'uri': 'redis://hg014:20019'
        },
        'mongo': {
            'uri': 'mongodb://hg014:20017/mock'
        },
        defaultResult:{result:"ok"},
        defaultError:function (messge) {
             return {result:"error",content:messge||""}
        },
        R:function (messge) {
             return {result:"ok",content:messge||""}
        }
    }
};
module.exports = config[env];
