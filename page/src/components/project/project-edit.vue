<style lang='less'>
.project-edit-vue{
  .project-edit-content{
    width: 650px;
    padding: 40px;
  }
  .proxy-list{
    padding: 0 0 10px 10px;
    .section{
      padding: 8px 0;
    }
  }
}
</style>
<template>
  <div class="project-edit-vue">
    <header>Project</header>
    <div class="project-edit-content">
      <Form :rules="rule" :model="project" ref="createForm" label-position="left" :label-width="130">
        <FormItem label="项目名" prop="name"><input type="text" v-model="project.name"></FormItem>
        <!-- <FormItem label="类型" prop="identification"><Radio :datas="[{key:1, title:'URL前缀'}, {key:0 , title:'HEAD参数'}]" v-model="project.identification"></Radio></FormItem> -->
        <FormItem label="简短介绍"><input type="text" v-model="project.summary"/></FormItem>
        <FormItem label="项目标识" prop="uniqueKey"><input type="text" v-model="project.uniqueKey"></FormItem>
        <FormItem label="swagger地址"><input type="text" v-model="project.swagger"></FormItem>
        <FormItem label="swagger前缀">
          <div class="h-input-group"><input type="text" v-model="project.rewritePath"><span class="h-input-addon"><span class="link">说明</span></span></div>
        </FormItem>
        <FormItem label="默认环境"><input type="text" v-model="project.proxy"></FormItem>
        <div class="proxy-list">
          <p class="section">反向代理列表</p>
          <div class="section" v-for="(p, index) of project.proxys" :key="index">
            <!-- <FormItem label="说明"><input type="text" v-model="project.proxy"></FormItem>
            <FormItem label="唯一标识"><input type="text" v-model="project.proxy"></FormItem>
            <FormItem label="代理地址"><input type="text" v-model="project.proxy"></FormItem> -->
            <div class="h-input-group">
              <span class="h-input-addon">环境</span>
              <input type="text" v-model="p.uniqueKey">
              <span class="h-input-addon">删除前缀</span>
              <input type="text" v-model="p.rewritePath">
              <span class="h-input-addon">代理地址</span>
              <input type="text" v-model="p.proxy" style="  width: 180px; flex: none;">
              <span class="h-input-addon" @click="analysis(p)"><span class="link">自动解析</span></span>
              <span class="h-input-addon" style="line-height: 30px;"><i class="h-icon-trash red-color pointer" @click="removeProxy(index)"></i></span>
            </div>
          </div>
          <div class="section">
            <Button text-color="primary" size="s" @click="addProxy">添加反向代理</Button>
          </div>
        </div>
      </Form>
    </div>
    <footer><button class="h-btn h-btn-red" style="float:left" @click="deleteProject()" v-if="project.id">删除</button><button class="h-btn" @click="close">取消</button><button class="h-btn h-btn-primary" @click="doCreate">确定</button></footer>
  </div>
</template>
<script>
import Project from 'model/project/Project';

export default {
  props: {
    params: Object
  },
  data() {
    return {
      project: this.params.project ? Utils.copy(this.params.project) : Project.parse({}),
      rule: {
        required: [ 'name', 'uniqueKey']
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    addProxy() {
      this.project.proxys.push({
        uniqueKey: null,
        proxy: null,
        rewritePath: null
      })
    },
    removeProxy(index) {
      this.project.proxys.splice(index, 1);
    },
    init() {
      
    },
    doCreate(){
      let validResult = this.$refs.createForm.valid();
      if (validResult.result) {
        let obj = Project.dispose(this.project);
        R.Project.editProject(obj).then((resp) => {
          if(resp.result == 'ok'){
            this.$Message.success("保存成功");
            this.$emit('event', 'refresh', Utils.copy(this.project));
            this.close();
          }
        });
      }
    },
    deleteProject() {
      this.$Confirm("确定删除？").then(()=>{
        R.Project.delete(this.project.id).then((resp) => {
          if(resp.result == 'ok'){
            this.$Message.success("删除成功");
            this.$emit('event', 'refresh');
            this.close();
          }
        });
      })
    },
    close() {
      this.$emit('close');
    },
  },
  computed: {
    
  }
}
</script>