import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import Vue from 'vue'
import project from './components/project.vue';
import mockSet from './components/mockSet.vue';
import Router from './lib/plugins/router/vue-router';



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
loadCss("lib/plugins/jsoneditor.min.css");

Vue.use(Router);

var routes = {
    '/': {
        component: project
    },
    '/:id': {
        name: 'mockSet',
        component: mockSet,
        subRoutes:{
            "/:name":function(id,name){
                this.vue.$broadcast("changeMenuBy",name);
            }
        }
    }
};

let VueParam = {
    el: '#body'
};

var router = new Router();

router.map(routes);
router.start(VueParam);


export default router;
