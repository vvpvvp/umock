<style lang='less'>
.app-project{
  .project{
    &-list{
      >li{
        border-top: @border;
        padding: 15px 2px;
      }
    }
    &-title{
      font-size: 17px;
    }
  }
}
</style>
<template>
  <div class="app-project">
    <div class="app-header-menu">
    </div>
    <div class="content-body">
      <ul class="path-list">
        <li v-for="project of list">
          <p><span class="path-title"><span class="project-author">{{project.beginPath.substr(0,1)}}</span><router-link :to="{name: 'detail', params:{id: project.id}}">{{project.name}}  /  {{project.beginPath}}</router-link></span><i class="h-split"></i><span class="gray-color">{{project.description}}</span>
          <span class="float-right text-hover"><i class="h-icon-setting"></i></span></p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

import Path from 'model/project/Path';
import Project from 'model/project/Project';

export default {
  data() {
    return {
      list: [],
      project: Project.parse({}),
      loading: true
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      R.Project.getProject(this.$route.params.id).then(resp=>{
        if(resp.status == 200){
          this.project = Project.parse(resp.content);
          this.getList();
        }
      });
    },
    getList() {
      R.Project.pathList(this.$route.params.id).then(resp=>{
        if(resp.status == 200){
          this.list = Path.parse(resp.content);
          this.getSwagger();
        }
      });
    },
    getSwagger() {
      this.loading = true;
      R.Project.swagger(this.project.swagger).then(resp=>{
        if(resp.status == 200){
          // this.list = Path.parse(resp.body);
        }
        this.loading = false;
      });
    },
  }
}
</script>
