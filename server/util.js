/**
 * Created by an.han on 15/7/21.
 */
'use strict';
var toString = Object.prototype.toString;

module.exports = {

    isArray: function(value) {
        return toString.call(value) === '[object Array]';
    },

    isObject: function(value) {
        return toString.call(value) === '[object Object]';
    },

    isFunction: function(value) {
        return toString.call(value) === '[object Function]';
    },

    isNotAOF:function (value) {
        return !(this.isFunction(value)||this.isArray(value)||this.isObject(value));
    },

    each: function(val, callback) {
        if (this.isArray(val)) {
            val.forEach(callback);
        }
        if (this.isObject(val)) {
            for (var key in val) {
                callback(val[key], key);
            }
        }
    },
    extendResultData: function(toObject, fromObj) {
        var utils = this;
        if (utils.isObject(fromObj)) {
            if(!utils.isObject(toObject)){
                toObject = fromObj;
            }else{
                for (var key in fromObj) {
                    if(toObject[key]==undefined||utils.isNotAOF(toObject[key])){
                        toObject[key] = fromObj[key];
                    }else{
                        this.extendResultData(toObject[key], fromObj[key]);
                    }
                }
            }
        }else if (utils.isArray(fromObj)) {
            if(!utils.isArray(toObject)){
                toObject = fromObj;
            }else if(fromObj.length==1){
                toObject.forEach((n,i)=>{
                    if(utils.isNotAOF(toObject[i])){
                        toObject[i] = fromObj[0];
                    }else{
                        this.extendResultData(toObject[i], fromObj[0]);
                    }
                });
            }else{
                fromObj.forEach((n,i)=>{
                    if(toObject.length<=i||utils.isNotAOF(toObject[i])){
                        toObject[i] = n;
                    }else{
                        this.extendResultData(toObject[i], n);
                    }
                });
            }
        }else if(utils.isNotAOF(toObject)){
            toObject = fromObj;
        }
    }
}
