import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import Vue from 'vue'
import project from './components/project.vue'

let loadCss = function(url){
    var v = "";
     var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url + v;
    document.getElementsByTagName("head")[0].appendChild(link);

};

if(WEBPACK_DEBUG){
	loadCss("index.css");
}else{
	require("./index.css");
}

var index = new Vue({
    el: 'body',
    components: {
        project
    }
});
