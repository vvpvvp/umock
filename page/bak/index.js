import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
// import "./index.css";
// import "./lib/plugins/jsoneditor.min.css";
import Vue from 'vue'
import App from './App.vue'

let loadCss = function(url){
    var v = "";
    // var v = window.location.hostname=="localhost"?"":("?v="+w.G.version);
    // for(var i = 0; i < arguments.length; i++) {
         var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url + v;
        document.getElementsByTagName("head")[0].appendChild(link);
    // }
};

// if(DEBUG)
if(WEBPACK_DEBUG){
	loadCss("index.css");
}else{
	require("./index.css");
}
loadCss("lib/plugins/jsoneditor.min.css");


var index = new Vue({
    el: '#container',
    components: {
        App
    }
});
