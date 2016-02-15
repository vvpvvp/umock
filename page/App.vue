<template>
<div>
    <div class="page-header" id="projects">
        <ul class="nav nav-tabs">
                <li v-for="project in projects" role="presentation" v-on:click="openList($index)" v-bind:class="{'active':now==$index}">
                    <a href="#">{{project.name}}&nbsp;&nbsp;<span class="pointer glyphicon glyphicon-edit"  data-toggle="modal" data-target="#projectModal" data-id={{$index}} data-type="edit" aria-hidden="true"></span></a>
                </li>
        </ul>
    </div>
    <div class="panel panel-default">
        <div class="panel-heading">配置
            <button type="button" class="btn btn-default btn-sm" aria-label="Left Align" data-toggle="modal" data-target="#editModal" data-type="create">
                <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>新增
            </button>
        </div>
            <mock-set :now-project="nowProject" v-ref:mock></mock-set>
    </div>
    <project-edit :now-project="nowProject"></project-edit>

</div>
</template>
<script>
import mockSet from './components/mockSet.vue'
import projectEdit from './components/projectEdit.vue'
export default {
    data(){
        return {
            projectStart: "/api/",
            projects: [],
            now: 0,
            nowProject:{}
        };
    },
    methods: {
        openList(index) {
            var P = this;
            this.now = index;
            this.nowProject = this.projects[index];
            Vue.nextTick(function () {
                P.$refs.mock.getList();
            })
        },
        init(){
            var P = this;
            $.get("/umock/project/list")
                .done(function(result) {
                    if (result.result == "ok") {
                        P.projects = result.content;
                        if(P.projects.length>0)P.openList(0);
                    }
                })
        }
    },
    ready(){
        this.init();
    },
    components: {
        mockSet,
        projectEdit
    }
}
</script>
