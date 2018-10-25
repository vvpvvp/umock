<style lang='less'>
.project-list{
  padding-bottom: 50px;
  .content-body-tabs{
    position: absolute;
    top: 10px;
    line-height: 56px;
    left: 200px;
    font-size: 18px;
    z-index: 2;
  }
  .project-list{
    >li{
      border-bottom: @border;
      position: relative;
      padding: 15px 12px;
      &:hover{
        background: lighten(@primary-color, 38%);
        .h-icon-setting{
          color: @primary-color;
        }
      }
    }

    .project-edit{
      right:10px;
      font-size: 18px;
      color: @gray-color;
    }
  }
}
</style>
<template>
  <div>
    <appHead></appHead>
    <div class="app-container">
      <div class="project-list">
        <div class="content-body">
          <div class="content-body-title">
            <span v-font="30">Projects</span>
            <div class="middle-right" v-font="20" @click="editProject()"><span class="link">创建</span></div>
          </div>
          <ul class="project-list">
            <li v-for="project of list" :key="project">
              <p><span class="project-title">
                <span class="project-author" :style="getBg(project)">{{project.uniqueKey.substr(0,1)}}</span>
              <router-link :to="{name: 'detail', params:{id: project.id}}">{{project.name}}  /  {{project.uniqueKey}}</router-link></span><i class="h-split"></i>
              <span class="gray-color">{{project.summary}}</span>
              <span class="project-edit middle" @click="editProject(project)"><i class="h-icon-setting text-hover"></i></span></p>
            </li>
          </ul>
        </div>
        <BackTop :target="getTarget" :bottom="40" :right="40"></BackTop>
      </div>
    </div>
  </div>
</template>
<script>

import Project from 'model/project/Project';
import appHead from '../app/app-header';
import ProjectEdit from './project-edit';

export default {
  data() {
    return {
      list: [],
      opened: false,
      project: Project.parse({}),
      menu: this.$route.query.menu || 'public'
    }
  },
  mounted() {
    this.getList();
  },
  watch: {
    '$route.query.menu'() {
      this.menu = this.$route.query.menu || 'public';
    }
  },
  methods: {
    change(tab) {
      this.$router.push({ name: 'index', query: { menu: tab.key }})
    },
    getTarget() {
      return document.querySelector('.app-body');
    },
    getBg(project) {
      const colors = ['rgb(223, 247, 233)', 'rgb(251, 237, 238)', 'rgb(230, 245, 255)', 'rgb(255, 239, 213)', 'rgb(250, 230, 253)', 'rgb(232, 234, 255)'];
      return {'background-color': colors[Math.round(Math.random() * 5)]};
    },
    getList() {
      R.Project.list().then((resp)=>{
        let projects = Project.parse(resp.content);
        this.list = projects;
      });
    },
    editProject(data) {
      this.$Modal({
        component: {
          vue: ProjectEdit,
          data: {
            project: data
          }
        },
        events: {
          refresh:() => {
            this.getList();
          }
        }
      })
    },
    analysis(p) {
      R.Project.getLocation().then((resp) => {
        let port = '';
        if (p.proxy) {
          let matchs = p.proxy.match(/\:(\d+)/);
          if(matchs && matchs.index){
            port = `:${matchs[1]}`;
          }
        }
        p.proxy= `http://${resp.ip}${port}`;
      });
    }
  },
  computed: {
  },
  components: {
    appHead
  }
}
</script>
