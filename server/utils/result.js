'use strict';

module.exports = {
    defaultResult:{
        result: "ok"
    },
    defaultError:function(messge) {
        return {
            result: "error",
            content: messge || ""
        };
    },
    R:function(messge) {
        return {
            result: "ok",
            content: messge || ""
        };
    }
};
