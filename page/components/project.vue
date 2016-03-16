<template>
<div>
    <div class="page-header">
        <h3>项目</h3>
    </div>
    <div class="">
        <!-- <ul class="list-group"> -->
            <!-- <li v-for="project in projects" role="presentation" v-bind:class="{ 'list-group-item': true, 'active': project.isPublic=='1'}">
                <a href="project.html?id={{project._id}}"><h4>{{project.name}}</a>&nbsp;&nbsp;<span class="pointer glyphicon glyphicon-edit"  data-toggle="modal" data-target="#projectModal" data-id={{$index}} data-type="edit" aria-hidden="true"></span></h4>
                <p class="list-group-item-text">{{project.beginPath}} （{{["HEAD前缀","URL前缀"][project.isPublic]}}）</p>
                <p class="list-group-item-text">{{project.desc}}</p>
            </li> -->
            <div v-for="project in projects"  v-bind:class="{ 'alert': true, 'alert-success': project.isPublic=='1', 'alert-gray': project.isPublic!='1'}" role="alert">
              <h4><span class="label {{['label-primary','label-success'][project.isPublic]}}">{{project.beginPath}}</span>&nbsp;&nbsp;<a href="project.html?id={{project._id}}" class="alert-link">{{project.name}}-{{["HEAD前缀","URL前缀"][project.isPublic]}}</a>&nbsp;&nbsp;<span class="pointer glyphicon glyphicon-edit"  data-toggle="modal" data-target="#projectModal" data-id={{$index}} data-type="edit" aria-hidden="true"></span></h4></a>
                <p>{{project.desc}}</p>
            </div>
        <!-- </ul> -->
    </div>
    <project-edit :projects="projects"></project-edit>

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
