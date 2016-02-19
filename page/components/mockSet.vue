<template>
    <div id="mockList">
        <div class="panel panel-default">
            <div class="panel-heading">配置
                <button type="button" class="btn btn-default btn-sm" aria-label="Left Align" data-toggle="modal" data-target="#editModal" data-type="create">
                    <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>新增
                </button>
            </div>
            <div v-for="mockset in mocksets | filterBy filterMenu in 'menuId'" track-by="_id" v-bind:class="{'active':mockset.active,'opened':mockset.opened,'mockDiv':true,'POST':mockset.type=='POST','GET':mockset.type=='GET'}">
                <div class="mocksetHeader" v-on:click.self="togglePane">
                    <span><span class="mockType">{{mockset.type}}</span><a href="javascript:;" v-on:click="testMock(mockset)"><code>{{mockset.url}}</code></a><span class="text-info">{{mockset.desc}}</span></span>
                    <div class="operator">
                        <button type="button" class="btn btn-default btn-xs" aria-label="Left Align" data-toggle="modal" data-target="#editModal" data-id={{mockset._id}}>
                            <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>编辑
                        </button>
                        <button type="button" class="btn btn-default btn-xs" aria-label="Left Align" v-on:click="delete(mockset)">
                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>删除
                        </button>
                        <button type="button" class="btn btn-primary btn-xs" v-if="mockset.active" aria-label="Left Align" v-on:click="disactive(mockset)">
                            <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>{{mockset.dataHandler=="over"?"覆盖":"拦截"}}中
                        </button>
                        <button type="button" class="btn btn-link btn-xs" v-else aria-label="Left Align" v-on:click="active(mockset)">
                            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>已关闭
                        </button>
                    </div>
                </div>
                <div class="mocksetContent">
                    <h4>Parameters</h4>
                    <p>{{mockset.param}}</p>
                    <h4>Response</h4>
                    <p>{{mockset.respParam}}</p>
                    <div>
                        <h4>Result</h4>
                        <pre><code class="json">{{mockset.result}}</code></pre>
                    </div>
                </div>
            </div>
            <mock-edit :mocksets="mocksets" :now-project="nowProject" :menus = "menus"></mock-edit>
        </div>
    </div>
</template>
<script>
import mockEdit from './mockEdit.vue'

function changeStatus(mockset, active) {
    var content = mockset;
    $.post("/umock/mockset/" + content._id, {
        _id: content._id,
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
    M.$dispatch("menuInit",M.menus);
}

export default {
    props: ['nowProject'],
    data() {
        return {
            // nowProject:{},
            // projectStart:"/api/",
            mocksets: [],
            filterMenu:"",
            menus:[]
        };
    },
    components: {
        mockEdit
    },
    methods: {
        active(mockset) {
            changeStatus(mockset, true);
        },
        disactive(mockset) {
            changeStatus(mockset, false);
        },
        togglePane(event) {
            if ($(event.target).hasClass("mocksetHeader"))
                $(event.target).next().slideToggle();
        },
        getList() {
            var M = this;
            $.get("/umock/list/" + M.nowProject._id)
                .done(function(result) {
                    if (result.result == "ok") {
                        M.mocksets = result.content;
                        initMenu(M);
                    }
                });
        },
        delete(mockset) {
            var vm = this;
            if (!confirm("确定删除")) return;
            $.ajax({
                    url: "/umock/mockset/" + mockset._id,
                    type: "delete"
                })
                .done((result) => {
                    if (result.result == "ok") {
                        vm.deleteById(mockset._id);
                        initMenu(vm);
                    }
                });
        },
        testMock(mockset){
            this.$dispatch('testMock', mockset);
        },
        deleteById(_id){
            let vm = this;
            vm.mocksets.forEach((n,i)=>{
                if(n._id == _id){
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
        }
    }
}
</script>
