<template>
<nav class="navbar navbar-default">
            <div class="navbar-header">
                <a class="navbar-brand" href="/#/">{{nowProject.name}}-{{["HEAD参数","URL前缀"][nowProject.isPublic]}}&nbsp;<span class="label label-success">{{nowProject.beginPath}}</span></a>
            </div>
            <div id="navbar" class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li :class={"active":!isDevelop}><a href="/#/mockset/{{id}}/list">列表</a></li>
                    <li :class={"active":isDevelop}><a href="/#/mockset/{{id}}/develop">开发</a></li>
                    <li><a href="https://github.com/vvpvvp/UMock#readme" target="_blank">文档</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <div id="container">
        <div id="mockMenu">
          <mock-menu v-ref:menu :now-project="nowProject" :menus="menus" :menu="menu"></mock-menu>
          <mock-developer v-ref:developer :developers="developers" :developer="developer"></mock-menu>
        </div>
        <div id="mockList">
        <div class="panel panel-default">
            <div class="panel-heading">配置
                <button type="button" class="btn btn-default btn-sm" aria-label="Left Align" data-toggle="modal" data-target="#editModal" data-type="create">
                    <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>新增
                </button>
            </div>
            <div v-for="mockset in filterMenus" track-by="id" v-bind:class="{'active':mockset.active,'opened':mockset.opened,'mockDiv':true,'POST':mockset.type=='POST','GET':mockset.type=='GET'}">
                <div class="mocksetHeader" v-on:click="togglePane($event,mockset)" attr-id="{{mockset.id}}">
                    <span class="font12">{{$index+1}}</span>&nbsp;&nbsp;<span class="mockType">{{mockset.type}}</span><a href="javascript:;" v-on:click="testMock(mockset)"><code>{{mockset.url}}</code></a><span class="text-info">{{mockset.shortDesc}}</span>

                    <div class="operator">
                        <span class="text-developer" v-if="mockset.develop">{{mockset.frontdevelop}}&nbsp;&nbsp;&nbsp;&nbsp;{{mockset.backdevelop}}&nbsp;&nbsp;</span>
                        <button type="button" v-if="mockset.develop" class="btn btn-primary btn-xs" aria-label="Left Align" @click="disdevelop(mockset)">
                            <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>开发中
                        </button>
                        <button type="button" v-else class="btn btn-link btn-xs" aria-label="Left Align" @click="develop(mockset)">
                            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>完成
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
                <div class="mocksetContent" :class="{'display':mockset.display}">
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
import mockDeveloper from './mockDeveloper.vue';
import Router from "../../index.js";

import ajax from "../../js/ajax";
import Mock from "../../js/Mock";

function changeStatus(mockset,column,active) {
    var content = mockset;
    ajax.postJson("/umock/mockset/" + content.id, {
        id: content.id,
        [column]: active
    }).done(() => {
        content[column] = active;
    });
}

let getURLParam = function(name, search) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(search || location.search) || [true, ""])[1].replace(/\+/g, '%20')) || null;
};

export default {
    data() {
        return {
            id:0,
            nowProject:{},
            mocksets: [],
            isDevelop:false,
            menu:"",
            menus:[],
            developer:"",
            developers:[]
        };
    },
    components: {
        mockEdit,
        mockTest,
        mockMenu,
        mockDeveloper
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
    computed:{
        filterMenus(){
            return this.mocksets.filter((item)=>{
                if(this.menu&&item.menuId!=this.menu){
                    return false;
                }
                if(this.developer&&item.frontdevelop!=this.developer&&item.backdevelop!=this.developer){
                    return false;
                }
                if(this.isDevelop&&!item.develop){
                    return false;
                }
                return true;
            })
        }
    },
    methods: {
        initMenu(){
            let M = this;
            M.menus = [...new Set(
                M.mocksets.filter((item)=>{
                    if(M.isDevelop&&!item.develop){
                        return false;
                    }
                    if(!item.menuId)return false;
                    return true;
                }).map((item)=>{
                    return item.menuId;
                })
            )];
            let ds = M.mocksets.filter((item)=>item.develop);
            let dlist = [];
            for (let d of ds) {
                if(d.frontdevelop)dlist.push(d.frontdevelop);
                if(d.backdevelop)dlist.push(d.backdevelop);
            }
            M.developers = [...new Set(dlist)];
        },
        develop(mockset){
            changeStatus(mockset,"develop", true);
        },
        disdevelop(mockset){
            changeStatus(mockset,"develop", false);
        },
        active(mockset) {
            changeStatus(mockset,"active", true);
        },
        disactive(mockset) {
            changeStatus(mockset,"active", false);
        },
        togglePane(event,mockset) {
            var bar = $(event.target);
            let url = "/mockset/"+this.$route.params.id+"/list?";
            if(window.location.hash.indexOf('/develop')!=-1){
                url = "/mockset/"+this.$route.params.id+"/develop?";
            }
            if(this.developer){
                url += "develop="+this.developer+"&";
            }else if(this.menu){
                url += "menu="+this.menu+"&";
            }
            url+= "id="+mockset.id;
            // console.log(url)
            Router.go(url);
            // mockset.display = !mockset.display;

            if (bar.hasClass("mocksetHeader"))
                bar.next().slideToggle();
            else if(bar.parent().hasClass("mocksetHeader"))
                bar.parent().next().slideToggle();
            else if(bar[0].tagName=="CODE")
                bar.parent().parent().next().slideDown();
        },
        getList() {
            var M = this;
            $.get("/umock/list/" + M.nowProject.id)
                .done(function(result) {
                    if (result.result == "ok") {
                        M.mocksets = Mock.parse(result.content);
                        M.initMenu();
                        Vue.nextTick(()=>{
                            if(M.$route.query.id){
                                $("[attr-id='"+M.$route.query.id+"']").next().slideDown();
                            }
                        })
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
                        vm.initMenu();
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
        testMock: function (mockset) {
            this.$refs.test.$emit("testMock",mockset);
        },
        reInitMenu:function(){
            this.initMenu();
        },
        developMode(isDevelop){
            this.menu = this.$route.query.menu||"";
            this.developer = this.$route.query.develop||"";
            this.isDevelop = isDevelop;
            this.initMenu();
        }
    }

}
</script>
