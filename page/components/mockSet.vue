<template>
<nav class="navbar navbar-default">
            <div class="navbar-header">
                <a class="navbar-brand" href="/#/">{{nowProject.name}}-{{["HEAD参数","URL前缀"][nowProject.isPublic]}}&nbsp;<span class="label label-success">{{nowProject.beginPath}}</span></a>
            </div>
            <div id="navbar" class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li><a href="https://github.com/vvpvvp/UMock#readme" target="_blank">文档</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <div id="container">
        <mock-menu v-ref:menu :now-project="nowProject"></mock-menu>
        <div id="mockList">
        <div class="panel panel-default">
            <div class="panel-heading">配置
                <button type="button" class="btn btn-default btn-sm" aria-label="Left Align" data-toggle="modal" data-target="#editModal" data-type="create">
                    <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>新增
                </button>
            </div>
            <div v-for="mockset in mocksets | filterBy filterMenu in 'menuId'" track-by="id" v-bind:class="{'active':mockset.active,'opened':mockset.opened,'mockDiv':true,'POST':mockset.type=='POST','GET':mockset.type=='GET'}">
                <div class="mocksetHeader" v-on:click="togglePane">
                    <span class="mockType">{{mockset.type}}</span><code>{{mockset.url}}</code><span class="text-info">{{mockset.shortDesc}}</span>
                    <div class="operator">
                        <button type="button" class="btn btn-default btn-xs" aria-label="Left Align" @click="testMock(mockset)">
                            <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>测试
                        </button>
                        <button type="button" class="btn btn-default btn-xs" aria-label="Left Align" data-toggle="modal" data-target="#editModal" data-id={{mockset.id}}>
                            <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>编辑
                        </button>
                        <button type="button" class="btn btn-default btn-xs" aria-label="Left Align" v-on:click="deleteMockset(mockset)">
                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>删除
                        </button>
                        <button type="button" class="btn btn-primary btn-xs" v-if="mockset.active" aria-label="Left Align" v-on:click.stop="disactive(mockset)">
                            <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>{{mockset.dataHandler=="over"?"覆盖":"拦截"}}中
                        </button>
                        <button type="button" class="btn btn-link btn-xs" v-else aria-label="Left Align" v-on:click.stop="active(mockset)">
                            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>已关闭
                        </button>
                    </div>
                </div>
                <div class="mocksetContent">
                    <pre><code>{{mockset.description}}</code></pre>
                </div>
            </div>
            <mock-edit :mocksets="mocksets" :now-project="nowProject" :menus ="menus"></mock-edit>
        </div>
    </div>
        <mock-test v-ref:test :now-project="nowProject"></mock-test>
    </div>
</template>
<script>
import mockEdit from './mockEdit.vue';
import mockTest from './mockTest.vue';
import mockMenu from './mockMenu.vue';
import ajax from "../js/ajax";

function changeStatus(mockset, active) {
    var content = mockset;
    ajax.postJson("/umock/mockset/" + content.id, {
        id: content.id,
        active: active
    }).done(() => {
        content.active = active;
    });
}

let getURLParam = function(name, search) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(search || location.search) || [true, ""])[1].replace(/\+/g, '%20')) || null;
};

function initMenu(M){
    M.menus = [...new Set(
        M.mocksets.map((item)=>{
            return item.menuId;
        })
    )];
    M.$broadcast("menuInit",M.menus);
}

export default {
    data() {
        return {
            id:0,
            nowProject:{},
            // projectStart:"/api/",
            mocksets: [],
            filterMenu:"",
            menus:[]
        };
    },
    components: {
        mockEdit,
        mockTest,
        mockMenu
    },
    ready(){
        var vm = this;
        var id = this.$route.params.id;
        this.id = id;
        $.get("/umock/project/" +id)
            .done(function(result) {
                if (result.result == "ok"){
                    vm.nowProject = result.content;
                    window.document.title = vm.nowProject.name;
                    Vue.nextTick(()=>{
                        vm.getList();
                    });
                }
            });
    },
    methods: {
        active(mockset) {
            changeStatus(mockset, true);
        },
        disactive(mockset) {
            changeStatus(mockset, false);
        },
        togglePane(event) {
            var bar = $(event.target);
            if (bar.hasClass("mocksetHeader"))
                bar.next().slideToggle();
            else if(bar.parent().hasClass("mocksetHeader"))
                bar.parent().next().slideToggle();
        },
        getList() {
            var M = this;
            $.get("/umock/list/" + M.nowProject.id)
                .done(function(result) {
                    if (result.result == "ok") {
                        M.mocksets = result.content;
                        initMenu(M);
                    }
                });
        },
        deleteMockset(mockset) {
            var vm = this;
            if (!confirm("确定删除")) return;
            $.ajax({
                    url: "/umock/mockset/" + mockset.id,
                    type: "delete"
                })
                .done((result) => {
                    if (result.result == "ok") {
                        vm.deleteById(mockset.id);
                        initMenu(vm);
                    }
                });
        },
        testMock(mockset){
            this.$broadcast('testMock', mockset);
        },
        deleteById(id){
            let vm = this;
            vm.mocksets.forEach((n,i)=>{
                if(n.id == id){
                    vm.mocksets.splice(i, 1);
                    return false;
                }
            });
        }
    },
    events:{
        changeMenu(menu){
            this.filterMenu = menu;
        },
        reInitMenu(){
            initMenu(this);
        },
        testMock: function (mockset) {
            this.$refs.test.$emit("testMock",mockset);
        }
    }

}
</script>
