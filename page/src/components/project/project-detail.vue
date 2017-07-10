<style lang='less'>
.app-project {
  .content-body-title{
    position: relative;
    margin-right: 5%;
    >div{
      padding-left: 210px;
    }
  }

  .search-input{
    position: fixed;
    z-index: 2;
    top: 10px;
    right: 110px;
  }
  .path-tags {
    &-container {
      position: fixed;
      bottom: 0;
      top: 50px;
      left: 0%;
      overflow: auto;
      background: @white-color;
    }
    &-list {
      padding-top: 20px;
      padding-bottom: 20px;
      width: 180px;
      font-size: 16px;
      >li {
        padding: 8px 20px 8px 0;
        text-align: right;
        &.tab-selected{
          color: @primary-color;
        }
      }
    }
  }
  .path {
    &-list {
      font-family: monospace;
      padding-left: 210px;
      padding-right: 5%;
      padding-top: 20px;
      padding-bottom: 50px;
    }

    &-head {
      border-radius: 3px;
      cursor: pointer;
      display: flex;
      padding: 5px;
      position: relative;
      align-items: center;
    }

    &-method {
      font-size: 14px;
      min-width: 80px;
      padding: 5px 0px;
      text-align: center;
      border-radius: 3px;
      background: #000;
      text-shadow: 0 1px 0 rgba(0, 0, 0, .1);
      font-family: Titillium Web, sans-serif;
      color: #fff;
      text-transform: Uppercase;
    }

    .theme(@color) {
      border: 1px solid @color;
      background-color: fade(@color, 5%);

      
      .path {
        &-head {
          .h-tag{
            background-color: fade(@color, 85%);
            color: #FFF;
          }
          &:hover{
            background-color: fade(@color, 15%);
          }
        }
        &-method {
          background-color: @color;
        }
        &-info {
          border-top: 1px solid @color;
        }
      }
    }

    &-li {
      margin: 0 0 15px;
      border: 1px solid #000;
      border-radius: 4px;
      box-shadow: 0 0 3px rgba(0, 0, 0, .19);
      transition: .3s cubic-bezier(0, 1, 0, 1);
      &-post {
        .theme(#49cc90);
      }
      &-get {
        .theme(#61affe);
      }
      &-put {
        .theme(#fca130);
      }
      &-delete {
        .theme(#f93e3e);
      }
      &-deprecated {
        .theme(#ebebeb);
        color: #ebebeb;
      }
    }

    &-info {
      border-top: 1px solid @primary-color;
      overflow: hidden;
      margin-bottom: -1px;
      max-height: 0;
      transition: max-height .2s cubic-bezier(0, 1, 0, 1);
      &-show {
        max-height: 10000px;
        transition: max-height .8s ease-in-out;
      }
      >div{
        padding: 20px;
      }
    }

    &-name {
      font-weight: 600;
      margin-left: 10px;
    }

    &-description {
      font-size: 13px;
      margin-left: 10px;
    }
  }

  h3 {
    font-size: 16px;
    margin: 10px 0;
  }
  h4{
    font-size: 14px;
    margin: 10px 0;
  }

  .path-info-body {
    border: 1px solid #EEE;
    padding: 10px;
    background: #ffffff;
  }
  .content-body-title{
    border: none;
  }
}
</style>
<template>
  <div class="app-project">
    <div class="content-body-title" v-font="18">
      <div>
        <span class="project-author">{{project.beginPath?project.beginPath.substr(0,1):''}}</span>
        <span class="project-title">{{project.name}} / {{project.beginPath}}</span>
        <!--<span>
          <span>
            Path
          </span>
          <span>
            Model
          </span>
        </span>-->
      </div>
    </div>
    <div class="search-input">
      <Search v-model="searchText" trigger-type="input" placeholder="查询接口"></Search>
    </div>
    <div>
      <div class="path-tags-container">
        <ul class="path-tags-list">
          <li class="text-hover" @click="changeTab(null)" :class="{'tab-selected': $route.query.tab == null}">All
            <span>{{paths.length}}</span>
          </li>
          <li v-for="tag of swagger.tags" :key="tag" class="text-hover" :class="{'tab-selected': $route.query.tab == tag.name}" @click="changeTab(tag.name)">{{tag.name}}
            <span>{{counts[tag.name]}}</span>
          </li>
        </ul>
      </div>
      <ul class="path-list">
        <li v-for="path of computedPaths" :key="path" class="path-li" :class="`path-li-${path.info.deprecated?'deprecated':path.method}`">
          <div class="path-head" @click="path.show=!path.show">
            <span class="path-method">{{path.method}}</span>
            <span class="path-name">{{path.path}}</span>
            <span class="path-description text-ellipsis">{{path.info.description||path.info.summary}}</span>
            <span class="middle-right"><span class="h-tag" v-for="tag of path.info.tags" :key="tag">{{tag}}</span></span>
          </div>
          <div class="path-info" :class="{'path-info-show': path.show}" v-if="path.show">
            <div>
              <h3>Parameters</h3>
              <p>
                <span v-if="path.info.consumes">content-type:{{path.info.consumes.join(',')}}</span>
              </p>
              <template v-if="path.parameters.query.length">
                <h4>Query</h4>
                <ul>
                  <paramView v-for="query of path.parameters.query" :param="query" :key="query"></paramView>
                </ul>
              </template>
              <template v-if="path.parameters.path.length">
                <h4>Path</h4>
                <ul>
                  <paramView v-for="path of path.parameters.path" :param="path" :key="path"></paramView>
                </ul>
              </template>
              <template v-if="path.parameters.formData.length">
                <h4>FormData</h4>
                <ul>
                  <paramView v-for="query of path.parameters.formData" :param="query" :key="query"></paramView>
                </ul>
              </template>
              <template v-if="path.parameters.body">
                <h4>Body</h4>
                <div class="path-info-body">
                  <paramView :param="path.parameters.body.model" :definitions="swagger.definitions"></paramView>
                </div>
              </template>
              <template v-if="path.responses">
              <h3>Responses</h3>
              <p>
                <span v-if="path.info.produces">content-type:{{path.info.produces.join(',')}}</span>
              </p>
              <h4>Body</h4>
              <div class="path-info-body">
                <paramView :param="path.responses" :definitions="swagger.definitions"></paramView>
              </div>
              </template>
              <h3>Remark</h3>
            </div>
  
          </div>
        </li>
      </ul>
    </div>

    <BackTop :target="getTarget" :bottom="40" :right="40"></BackTop>
  </div>
</template>
<script>

import Path from 'model/project/Path';
import Project from 'model/project/Project';
import Beautify from 'components/common/js-beautify';
import paramView from 'components/common/param-view';

export default {
  data() {
    return {
      list: [],
      project: Project.parse({}),
      loading: true,
      swagger: {},
      paths: [],
      models: {},
      counts: {},
      searchText: null
    }
  },
  mounted() {
    this.$Loading("加载中");
    this.getData();
  },
  methods: {
    getTarget() {
      return document.querySelector('.app-body');
    },
    changeTab(tab) {
      this.$router.push({name: 'detail', params: {id: this.$route.params.id}, query: {tab: tab}});
    },
    getData() {
      this.loading = true;
      R.Project.getProject(this.$route.params.id).then(resp => {
        if (resp.result == 'ok') {
          this.project = Project.parse(resp.content);
          this.getList();
        }
      });
    },
    getList() {
      R.Project.pathList(this.$route.params.id).then(resp => {
        if (resp.result == 'ok') {
          this.list = Path.parse(resp.content);
          this.getSwagger();
        }
      });
    },
    getSwagger() {
      if (this.project.swagger) {
        R.Project.swagger(this.project.swagger).then(resp => {
          if(!resp){
            this.$Loading.close();
            return;
          }
          this.swagger = resp;
          let paths = [];
          let counts = {};
          for (let path in this.swagger.paths) {
            let pathInfo = this.swagger.paths[path];
            for (let method in pathInfo) {
              let info = pathInfo[method];
              if (info.tags) {
                for (let tag of info.tags) {
                  counts[tag] = (counts[tag] || 0) + 1;
                }
              }
              let parameters = { query: [], formData: [], body: null, path:[] };
              for (let param of info.parameters) {
                if (param.in == 'query') {
                  parameters.query.push(param);
                } else if (param.in == 'formData') {
                  parameters.formData.push(param);
                } else if (param.in == 'path') {
                  parameters.path.push(param);
                } else if (param.in == 'body') {
                  param.model = param.schema;
                  parameters.body = param;
                }
              }
              let responses = null;
              for (let status in info.responses) {
                let isJson = false;
                if(info.produces){
                  isJson = info.produces.some((data)=>{
                    return data.indexOf('application/json') != -1;
                  })
                }
                if (status == 200 && isJson) {
                  responses = info.responses[status].schema;
                }
              }
              paths.push({ path, method, info, parameters, responses, show: false });
            }
          }
          this.paths = paths;
          this.counts = counts;
          this.$Loading.close();
        });
      } else {
        this.analysis();
        this.$Loading.close();
      }
    },
    analysis() {

    }
  },
  computed: {
    computedPaths() {
      if(this.searchText){
        return this.paths.filter((path) => {
          return path.path.indexOf(this.searchText) > -1;
        });
      }
      if(this.$route.query.tab){
        return this.paths.filter((path) => {
          if(!path.info.tags){
            return false;
          }
          return path.info.tags.indexOf(this.$route.query.tab) > -1;
        });
      }
      return this.paths;
    }
  },
  components: {
    Beautify,
    paramView
  }
}
</script>
