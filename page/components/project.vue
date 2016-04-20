<template>
<div>
    <!-- Fixed navbar -->
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <a class="navbar-brand" href="#">Mock Server</a>
            </div>
            <div id="navbar" class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li class="active"><a href="/">Home</a></li>
                    <li><a href="https://github.com/vvpvvp/UMock#readme" target="_blank">文档</a></li>
                </ul>
                <span class="glyphicon glyphicon-plus newProject" aria-hidden="true" data-toggle="modal" data-target="#projectModal"  data-type="create">添加项目</span>
            </div>
            <!--/.nav-collapse -->
        </div>
        </div>
    </nav>

    <div class="container">
        <div class="page-header">
            <h3>项目</h3>
        </div>
        <div class="">
            <div v-for="project in projects"  v-bind:class="{ 'alert': true, 'alert-success': project.isPublic=='1', 'alert-gray': project.isPublic!='1'}" role="alert">
              <h4><span class="label {{['label-primary','label-success'][project.isPublic]}}">{{project.beginPath}}</span>&nbsp;&nbsp;<a  v-link="{name:'mockSet',params:{id:project._id}}" class="alert-link">{{project.name}}-{{["HEAD参数","URL前缀"][project.isPublic]}}</a>&nbsp;&nbsp;<span class="pointer glyphicon glyphicon-edit"  data-toggle="modal" data-target="#projectModal" data-id={{$index}} data-type="edit" aria-hidden="true"></span></h4></a>
                <p>{{project.desc}}</p>
            </div>
        </div>
    <project-edit :projects="projects"></project-edit>
    </div>
</div>
</template>
<script>
import projectEdit from './projectEdit.vue'
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
        init(){
            var P = this;
            $.get("/umock/project/list")
                .done(function(result) {
                    if (result.result == "ok") {
                        P.projects = result.content;
                    }
                })
        }
    },
    ready(){
        this.init();
    },
    components: {
        projectEdit
    }
}
</script>
