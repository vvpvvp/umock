import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import Vue from 'vue'
import mockSet from './components/mockSet.vue'
import mockTest from './components/mockTest.vue'
import mockMenu from './components/mockMenu.vue'

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

let getURLParam = function(name,search) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(search||location.search)||[true,""])[1].replace(/\+/g, '%20'))||null;
};


var index = new Vue({
    el: 'body',
    data() {
        return {
            nowProject:{},
            // projectStart:"/api/",
            mocksets: []
        };
    },
    components: {
        mockSet,
        mockTest,
        mockMenu
    },
    ready(){
        var id = getURLParam("id",window.location.search);
        this.id = id;
        var vm = this;
        $.get("/umock/project/" +id)
                .done(function(result) {
                    if (result.result == "ok"){
                        vm.nowProject = result.content[0];
                        window.document.title = vm.nowProject.name;
                        Vue.nextTick(()=>{
                            vm.$refs.set.getList();
                        });
                        
                    }
                });
    },
    methods: {
        
    },
    events: {
        'testMock': function (mockset) {
            this.$refs.test.$emit("testMock",mockset);
        },
        menuInit(menus){
            this.$refs.menu.$emit("menuInit",menus);
        },
        changeMenu(menu){
            this.$refs.set.$emit("changeMenu",menu);
        }
    }
});
