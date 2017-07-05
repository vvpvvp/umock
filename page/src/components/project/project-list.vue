<style lang='less'>
.project-list{
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
  <div class="project-list">
    <div class="content-body">
      <div class="content-body-title">
        <span v-font="30">Projects</span>
        <Tabs class="content-body-tabs" :datas="{public: '公共', private: '私有'}" v-model="menu" @change="change"></Tabs>
        <div class="middle-right" v-font="20" @click="editProject()"><span class="link">创建</span></div>
      </div>
      <ul class="project-list">
        <li v-for="project of projectList" :key="project">
          <p><span class="project-title">
            <span class="project-author" :style="getBg(project)">{{project.name.substr(0,1)}}</span>
          <router-link :to="{name: 'detail', params:{id: project.id}}">{{project.name}}  /  {{project.beginPath}}</router-link></span><i class="h-split"></i>
          <span class="gray-color">{{project.description}}- <span v-font="13">{{project.isPublic?'URL前缀':'HEAD参数'}}</span></span>
          <span class="project-edit middle" @click="editProject(project)"><i class="h-icon-setting text-hover"></i></span></p>
        </li>
      </ul>
    </div>
    <Modal v-model="opened">
      <div slot="header">Project</div>
      <div v-width="500">
        <Form :rules="rule" :model="project" ref="createForm" :label-width="120">
          <FormItem label="项目名" prop="name"><input type="text" v-model="project.name"></FormItem>
          <FormItem label="类型" prop="isPublic"><Radio :datas="[{key:1, title:'URL前缀'}, {key:0 , title:'HEAD参数'}]" v-model="project.isPublic"></Radio></FormItem>
          <FormItem label="识别参数" prop="beginPath"><input type="text" v-model="project.beginPath"></FormItem>
          <FormItem label="去除url前缀"><input type="text" v-model="project.rewrite"></FormItem>
          <FormItem label="反向代理" prop="proxy"><div class="h-input-group"><input type="text" v-model="project.proxy"><span class="h-input-addon" @click="analysis()"><span class="link">自动解析</span></span></div></FormItem>
          <FormItem label="private"><Radio dict="Private" v-model="project.private"></Radio></FormItem>
          <FormItem label="swagger"><input type="text" v-model="project.swagger"></FormItem>
          <FormItem label="描述"><textarea v-autosize v-model="project.description"></textarea></FormItem>
        </Form>
      </div>
      <div slot="footer"><button class="h-btn h-btn-red" style="float:left" @click="deleteProject()" v-if="project.id">删除</button><button class="h-btn" @click="close">取消</button><button class="h-btn h-btn-primary" @click="doCreate">确定</button></div>
    </Modal>
    <BackTop :target="getTarget" :bottom="40" :right="40"></BackTop>
  </div>
</template>
<script>

import Project from 'model/project/Project';

export default {
  data() {
    return {
      list: [],
      opened: false,
      project: Project.parse({}),
      menu: this.$route.query.menu || 'public',
      rule: {
        required: [ 'name', 'beginPath', 'isPublic', 'proxy', 'private']
      }
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
        this.list = Project.parse(resp.content);
      });
    },
    editProject(data) {
      this.project = data?Utils.copy(data):Project.parse({});
      this.opened = true;
    },
    close() {
      this.opened = false;
      this.project = Project.parse({});
    },
    deleteProject() {
      this.$Confirm("确定删除？").then(()=>{
        R.Project.delete(this.project.id).then((resp) => {
          if(resp.result == 'ok'){
            this.$Message.success("删除成功");
            this.getList();
            this.close();
          }
        });
      })
    },
    doCreate(){
      let validResult = this.$refs.createForm.valid();
      if (validResult.result) {
        let obj = Project.dispose(this.project);
        R.Project.editProject(obj).then((resp) => {
          if(resp.result == 'ok'){
            this.$Message.success("保存成功");
            this.getList();
            this.close();
          }
        });
      }
    },
    analysis() {
      R.Project.getLocation().then((resp) => {
        let port = '';
        if (this.project.proxy) {
          let matchs = this.project.proxy.match(/\:(\d+)/);
          if(matchs.index){
            port = `:${matchs[1]}`;
          }
        }
        this.project.proxy= `http://${resp.ip}${port}`;
      });
    }
  },
  computed: {
    projectList() {
      // return this.list;
      let isPrivate = this.menu == 'public' ? 2 : 1;
      return this.list.filter(item=>item.private == isPrivate);
    }
  }
}
</script>
