<style lang='less'>
.app-home{
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
    @width: 40px;
    &-author{
      color: @dark-color;
      background: @gray4-color;
      border: @border;
      height: @width;
      width: @width;
      text-align: center;
      line-height: @width;
      border-radius: 25px;
      font-size: 20px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
      text-transform: Uppercase;
    }
  }
}
</style>
<template>
  <div class="app-home">
    <div class="app-header-menu">
    </div>
    <div class="content-body">
      <div class="content-body-title" v-font="30">Projects</div>
      <ul class="project-list">
        <li v-for="project of list">
          <p><span class="project-title"><span class="project-author">{{project.beginPath.substr(0,1)}}</span><router-link :to="{name: 'detail', params:{id: project.id}}">{{project.name}}  /  {{project.beginPath}}</router-link></span><i class="h-split"></i><span class="gray-color">{{project.description}}</span>
          <span class="float-right text-hover"><i class="h-icon-setting"></i></span></p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

import Project from 'model/project/Project';

export default {
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      R.Project.list().then((resp)=>{
        this.list = Project.parse(resp.content);
      });
    }
  }
}
</script>
