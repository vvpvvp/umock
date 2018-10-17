<style lang='less'>
@menu-width: 200px;
.app-project {
  .body-title{
    border: none;
    top: 0px;
    z-index: 2;
    .back-icon{
      position: absolute;
      top: 8px;
      left: 20px;
    }
    .title {
      padding: 10px 0 0px @menu-width;
    }
  }

  .search-input{
    position: absolute;
    z-index: 2;
    top: 10px;
    right: 40px;
  }
  .h-tabs-default{
    position: absolute;
    left: 0;
    right: 0;
    z-index: 2;
    background: #FFF;
    padding-left: @menu-width + 38px;
    > div {
      line-height: 30px;
      text-align: center;
    }
  }
  .path-container {
    padding-top: 50px;
  }
  .path-tags {
    &-container {
      position: fixed;
      bottom: 0;
      top: 50px;
      left: 0%;
      background: @white-color;
    }
    &-list {
      overflow: auto;
      padding-top: 20px;
      padding-bottom: 20px;
      width: 200px;
      font-size: 16px;
      position: absolute;
      top: 50px;
      right: 0;
      bottom: 0;
      left: 0;
      >li {
        padding: 8px 20px 8px 0;
        text-align: right;
        &.tab-selected{
          color: @primary-color;
        }
        .tag-name{
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 120px;
          line-height: 18px;
          display: inline-block;
          vertical-align: -3px;
        }
      }
    }
  }

  .add-path-button {
    // position: absolute;
    // z-index: 3;
    // right: 40px;
    // top: 80px;
  }
  .path-list-container {
    position: absolute;
    right: 0;
    left: @menu-width;
    top: 100px;
    bottom: 0;
    overflow: auto;
    padding: 35px;
  }
  .path {
    &-list {
      font-family: monospace;
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
      font-size: 16px;
      line-height: 1.2;
      font-weight: 700;
      min-width: 80px;
      padding: 5px 0px;
      text-align: center;
      border-radius: 3px;
      background: #000;
      text-shadow: 0 1px 0 rgba(0, 0, 0, .1);
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
          .h-icon-link {
            font-size: 12px;
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
        .theme(#646464);
        color: #646464;
      }
    }

    &-info {
      border-top: 1px solid @primary-color;
      overflow: hidden;
      margin-bottom: -1px;
      // max-height: 0;
      // transition: max-height 2s cubic-bezier(0, 1, 0, 1);
      // &-show {
      //   max-height: 10000px;
      //   transition: max-height 2s ease-in-out;
      // }
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
}
</style>
<template>
  <div class="app-project">
    <div class="body-title">
      <span class="back-icon link app-header-title" @click="goBack">UMock</span>
      <div class="title">
        <span class="project-author">{{project.beginPath?project.beginPath.substr(0,1):''}}</span>
        <span class="project-title">{{project.name}} / {{project.beginPath}}</span>
      </div>
      <div class="search-input">
        <Search v-model="searchText" trigger-type="input" placeholder="查询接口"></Search>
      </div>
    </div>
    <Tabs :datas="tabs" v-model="nowTab" @change="changeClassify">
      <template slot-scope="props" slot="item"><span>{{props.tab.title}} ( {{props.tab.key == 'swagger' ? paths.length:mocksets.length}} )</span></template>
    </Tabs>
    <div class="path-container">
      <div class="path-tags-container">
        <ul class="path-tags-list" key="swagger" v-if="nowTab == 'swagger'">
          <li class="text-hover" @click="changeTab(null)" :class="{'tab-selected': $route.query.tab == null}">All
            <span>{{paths.length}}</span>
          </li>
          <li v-for="tag of swagger.tags" :key="tag" class="text-hover" :class="{'tab-selected': $route.query.tab == tag.name}" @click="changeTab(tag.name)">
            <span class="tag-name">{{tag.name}}</span>
            <span>{{counts[tag.name]}}</span>
          </li>
        </ul>
        <ul class="path-tags-list" key="defined" v-else>
          <li><Button color="primary" class="add-path-button" @click="EditMockset()">新增接口</Button></li>
          <li class="text-hover" @click="changeTab(null)" :class="{'tab-selected': $route.query.tab == null}">
            All
            <span>{{mocksets.length}}</span>
          </li>
          <li v-for="m of mocksetObj.menus" :key="m" class="text-hover" :class="{'tab-selected': $route.query.tab == m}" @click="changeTab(m)">
            <span class="tag-name">{{m}}</span>
            <span>{{mocksetObj.objects[m].length}}</span>
          </li>
        </ul>
      </div>
      <div class="path-list-container">
        <ul class="path-list" key="swagger" v-if="nowTab == 'swagger'">
          <li v-for="path of computedPaths" :key="path" class="path-li" :class="`path-li-${path.info.deprecated?'deprecated':path.method}`">
            <div class="path-head" @click="changeShowUrl(path.totalUrl)">
              <span class="path-method">{{path.method}}</span>
              <span class="path-name">{{path.path}} <span class="h-icon-link text-hover" theme="white" v-tooltip @click.stop="copy(path.path)" content="复制链接"></span></span>
              <span class="path-description text-ellipsis">{{path.info.summary}}</span>
              <span class="middle-right"><span class="h-tag" v-for="tag of path.info.tags" :key="tag">{{tag}}</span></span>
            </div>
            <div class="path-info" :class="{'path-info-show': path.totalUrl == showPath}" v-if="path.totalUrl == showPath">
              <div>
                <h3 v-if="path.info.description">Description</h3>
                <pre>{{path.info.description}}</pre>
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
              </div>
    
            </div>
          </li>
        </ul>
        <ul class="path-list" key="defined" v-else>
          <li v-for="path of computedMocksets" :key="path" class="path-li" :class="`path-li-${path.type}`">
            <div class="path-head" @click="changeShowUrl(path.totalUrl)">
              <span class="path-method">{{path.type}}</span>
              <span class="path-name">{{path.url}} <span class="h-icon-link text-hover" theme="white" v-tooltip @click.stop="copy(path.url)" content="复制链接"></span></span>
              <span class="path-description text-ellipsis">{{path.shortDesc}}</span>
              <span class="middle-right" v-if="path.menuId"><span class="h-tag">{{path.menuId}}</span></span>
            </div>
            <div class="path-info" :class="{'path-info-show': path.totalUrl == showPath}" v-if="path.totalUrl == showPath">
              <div>
                <div class="gray-color float-right"><span class="text-hover" @click="EditMockset(path)">编辑</span><span class="h-split"></span><span class="text-hover" @click="deleteMockset(path)">删除</span></div>
                <h3>Description</h3>
                <pre>{{path.description}}</pre>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <span class="copy-path" :data-clipboard-text="nowPath"></span>
    <BackTop :target="getTarget" :bottom="40" :right="40"></BackTop>
  </div>
</template>
<script>

import Path from 'model/project/Path';
import Project from 'model/project/Project';
import Beautify from 'components/common/js-beautify';
import paramView from 'components/common/param-view';
import EditMockset from 'components/common/edit-mockset';
// import AceEditor from 'components/common/Ace.component';

import Clipboard from 'clipboard';
export default {
  data() {
    return {
      project: Project.parse({}),
      loading: true,
      swagger: {},
      paths: [],
      models: {},
      counts: {},
      searchText: null,
      mocksets: [],
      mocksetObj: {
        menus: [],
        objects: []
      },
      showPath: this.$route.query.url,
      nowPath: "",
      nowTab: this.$route.query.classify || 'swagger',
      tabs: {
        swagger: 'Swagger',
        defined: '自定义'
      },
      swaggerVersion: "2.0",
    }
  },
  mounted() {
    this.$Loading("加载中");
    this.getData();
    this.$nextTick(() => {
      var clipboard = new Clipboard('.copy-path');
    })
  },
  methods: {
    goBack() {
      this.$router.push('/');
    },
    scrollToPath() {
      this.$nextTick(() => {
        let focus = this.$el.querySelector('.path-info-show');
        if(focus) {
          HeyUI.$ScrollIntoView(focus, {
            time: 500,
            align:{
              top: 0, //视图比例 0 to 1, 默认 0.5 (center)
              topOffset: 120, //视图位移 pixels to offset top alignment
            },
          });
        }
      })
    },
    scrollToTop() {
      this.$nextTick(()=>{
        document.querySelector('.path-list-container').scrollTop = 0;
      });
    },
    changeShowUrl(url) {
      if (this.showPath == url) {
        this.showPath = "";
      } else {
        this.showPath = url;
        this.$router.push({name: 'detail', params: {id: this.$route.params.id}, query: {classify: this.$route.query.classify, tab: this.$route.query.tab, url: url}});
        this.scrollToPath();
      }
    },
    copy(path) {
      this.nowPath = path;
      this.$Message.info('复制成功');
      this.$nextTick(()=>{
        document.querySelector('.copy-path').click();
      });
    },
    getTarget() {
      return document.querySelector('.path-list-container');
    },
    changeClassify(tab) {
      this.$router.push({name: 'detail', params: {id: this.$route.params.id}, query: {classify: tab.key}});
      this.scrollToTop();
    },
    changeTab(tab) {
      this.$router.push({name: 'detail', params: {id: this.$route.params.id}, query: {tab: tab, classify: this.$route.query.classify}});
      this.searchText = null;
      this.scrollToTop();
    },
    deleteMockset(path) {
      if(!path.id) return;
      this.$Confirm('确定删除？').then(()=>{
        R.Mockset.delete(path.id).then(resp => {
          if (resp.result == 'ok') {
            this.getList();
          }
        });
      });
    },
    getData() {
      this.loading = true;
      R.Project.getProject(this.$route.params.id).then(resp => {
        if (resp.result == 'ok') {
          this.project = Project.parse(resp.content);
          this.getList();
          this.getSwagger();
        }
      });
    },
    getList() {
      R.Project.pathList(this.$route.params.id).then(resp => {
        if (resp.result == 'ok') {
          for(let c of resp.content) {
            c.type = (c.type || 'get').toLowerCase();
            c.show = false;
            c.totalUrl= `${c.type}${c.url}`
          }
          this.mocksets = Path.parse(resp.content);
          let menus = [];
          let mocksetObj = {};
          for(let m of resp.content) {
            if(!m.menuId) continue;
            if(menus.indexOf(m.menuId) == -1) {
              menus.push(m.menuId);
              mocksetObj[m.menuId] = [];
            }
            mocksetObj[m.menuId].push(m);
          }
          this.mocksetObj.menus = menus;
          this.mocksetObj.objects = mocksetObj;
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
          if(resp.openapi) {
            this.swaggerVersion = '3.0';
            resp.definitions = resp.components.schemas;
          }
          this.swagger = resp;
          let tags = this.swagger.tags || [];
          let paths = [];
          let counts = {};
          for (let path in this.swagger.paths) {
            let pathInfo = this.swagger.paths[path];
            for (let method in pathInfo) {
              let info = pathInfo[method];
              if (info.tags) {
                for (let tag of info.tags) {
                  if(!tags.some(item => item.name == tag)) {
                    tags.push({name: tag});
                  }
                  counts[tag] = (counts[tag] || 0) + 1;
                }
              }
              let parameters = { query: [], formData: [], body: null, path:[] };
              if(info.parameters) {
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
              }
              let responses = null;
              info.produces = info.produces || [];
              if(this.swaggerVersion == '3.0') {
                if(info.requestBody) {
                  for (let param in info.requestBody.content) {
                    parameters.body = {in: 'body', model: info.requestBody.content[param].schema}
                    // info.produces.push(param);
                  }
                }
              }
              if(info.responses) {
                for (let status in info.responses) {
                  let isJson = false;
                  if(this.swaggerVersion == '3.0') {
                    for (let param in info.responses[status].content) {
                      responses = info.responses[status].content[param].schema;
                      info.produces.push(param);
                    }
                  } else {
                    if(info.produces){
                      isJson = info.produces.some((data)=>{
                        return data.indexOf('application/json') != -1;
                      })
                    }
                    if (status == 200 && isJson) {
                      responses = info.responses[status].schema;
                    }
                  }
                }
              }
              paths.push({ totalUrl: `${method}${path}`,path, method, info, parameters, responses, show: false });
            }
          }
          // log(tags)
          this.swagger.tags = tags.sort((a, b)=>{return a.name > b.name ? 1 : -1});
          this.paths = paths;
          this.counts = counts;
          this.$Loading.close();
          this.scrollToPath();
        });
      } else {
        this.scrollToPath();
        this.$Loading.close();
      }
    },
    EditMockset(mockset = null) {
      this.$Modal({
        hasCloseIcon: true,
        // fullScreen: true,
        component: {
          vue: EditMockset,
          data: {
            mockset: mockset || {projectId: this.project.id},
            menus: this.mocksetObj.menus
          }
        },
        events: {
          success: ()=>{
            this.getList();
          }
        }
      })
    }
  },
  computed: {
    computedMocksets() {
      if(this.searchText){
        return this.mocksets.filter((path) => {
          return path.url.indexOf(this.searchText) > -1 || (path.shortDesc||'').indexOf(this.searchText) > -1;
        });
      }
      if(this.$route.query.tab) {
        return this.mocksetObj.objects[this.$route.query.tab];
      } else {
        return this.mocksets;
      }
    },
    computedPaths() {
      if(this.searchText){
        return this.paths.filter((path) => {
          return path.path.indexOf(this.searchText) > -1 || (path.info.summary||'').indexOf(this.searchText) > -1;
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
    paramView,
  }
}
</script>
