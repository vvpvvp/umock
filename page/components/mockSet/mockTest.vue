<template>
  <div id="mockTest">
    <div id="testTopButton">
      <button type="button" class="btn btn-default btn-xs expand" v-if="!isHide" v-on:click="expand">{{isExpand?"最小化":"最大化"}}</button>
      <button type="button" class="btn btn-default showButton btn-xs" :class="{'btn-primary':isHide}" v-on:click="hide()">{{isHide?"测试":"隐藏"}}</button>
    </div>
    <div class="mockTestContainer">
      <div class="form">
        <form class="form-horizontal">
          <div class="form-group">
            <label for="recipient-name" class="control-label">URL:</label>
            <input type="text" class="form-control" v-model="url">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="control-label">参数:</label>
            <!-- <input type="text" class="form-control" v-model="param"> -->
            <div id="paramJson"></div>
          </div>
          <div class="form-group" v-show="isPost">
            <label for="recipient-name" class="control-label">POST参数:</label>
            <!-- <textarea class="form-control" rows="5" v-model="postParam"></textarea> -->
            <div id="postParamJson"></div>
          </div>
          <div class="form-group">
            <label for="recipient-name" class="control-label">Header:</label>
            <div id="headersJson"></div>
          </div>
        </form>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" id="editButton" v-on:click="test">{{type}}</button>
        </div>
      </div>
      <div id="testResult"></div>
    </div>
  </div>
</template>
<script>
import JSONEditor from "jsoneditor";

function getEmptyObject() {
  return {
    isHide: false,
    isExpand: false,
    num: 0,
    _id: "",
    url: "",
    desc: "",
    result: "",
    respParam: "",
    dataHandler: "",
    param: "",
    type: "测试",
    active: true,
    postParam: "",
    headers: ""
  }
}

function model(toO, fromO) {
  toO.id = fromO.id;
  // if(toO.nowProject.isPublic!="1"){
  //     toO.url = fromO.url.substring(toO.nowProject.beginPath.length);
  // }else{
  toO.url = fromO.url;
  // }

  toO.result = "";
  toO.desc = fromO.desc;
  toO.type = fromO.type;
  toO.dataHandler = fromO.dataHandler;
  toO.param = fromO.param;
  toO.respParam = fromO.respParam;
  toO.postParam = fromO.postParam || "";
  // toO.headers = `{"X-UFish-Authorization":"Basic ","author":""}`;
  if (fromO.active != undefined) toO.active = fromO.active;
}

export default {
  props: ["nowProject"],
  data() {
    return getEmptyObject();
  },
  ready() {
    var vm = this;
    var container = document.getElementById('testResult');
    var options = {
      mode: 'view'
    };
    this.hide();
    this.editor = new JSONEditor(container, options, {});


    var options2 = {
      mode: 'code',
      modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
      onError: function(err) {
        alert(err.toString());
      },
      onModeChange: function(newMode, oldMode) {
        console.log('Mode switched from', oldMode, 'to', newMode);
      }
    };
    var j = {
      "X-UFish-Authorization": "",
      "X-UFish-Source": "Server,Web/1.4.9.dev.11",
      "author": ""
    };
    this.headerEditor = new JSONEditor(document.getElementById("headersJson"), options2, j);
    this.paramEditor = new JSONEditor(document.getElementById("paramJson"), options2);
    this.postParamEditor = new JSONEditor(document.getElementById("postParamJson"), options2);

  },
  computed: {
    isPost() {
      return this.type != 'GET'
    }
  },
  methods: {
    expand: function(event) {
        this.isExpand = !this.isExpand;
      $("#mockTest").toggleClass("expand");
    },
    hide: function(setValue) {
      this.isHide = setValue==undefined?!this.isHide:setValue;
      if (this.isHide) {
        $("#mockList,#mockTest").addClass("hideTest");
      } else {
        $("#mockList,#mockTest").removeClass("hideTest");
      }
    },
    test() {
      let vm = this;
      if (!vm.url) return false;
      let ajaxParam = {
        url: vm.url,
        type: vm.type,
        processData: false,
        dataType: "json",
        success(result) {
          // vm.result = JSON.stringify(result);
          vm.editor.set(result);
        },
        error: function(e) {
          let responseText = e.responseText;
          try {
            responseText = JSON.parse(responseText);
          } catch (e) {}
          var result = {
            "Status": e.status,
            "Result": responseText
          }
          vm.editor.set(result);
        }
      };
      let headers;
      if (vm.headerEditor.getText() != "") {
        try {
          headers = vm.headerEditor.get();
        } catch (e) {
          // console.log(e);
          alert("header格式错误");
          return false;
        }
        ajaxParam.headers = headers;
      }

      if (vm.postParamEditor.getText() != '' && vm.postParamEditor.getText() != "{}") {
        try {
          ajaxParam.data = vm.postParamEditor.getText();
        } catch (e) {
          alert("postParam格式错误");
          return false;
        }
        ajaxParam.contentType = "application/json;charset=UTF-8";
        if (vm.paramEditor.getText() != '') {
          var param = vm.paramEditor.get();
          param = $.param(param);
          ajaxParam.url = vm.url + ("?".indexOf(vm.url) == -1 ? "?" : "&") + param;
        }
      } else {
        if (vm.paramEditor.getText() != '') {
          var param = vm.paramEditor.get();
          ajaxParam.data = param;
          ajaxParam.processData = true;

        }
      }
      $.ajax(ajaxParam);
    }
  },
  events: {
    'testMock': function(mockset) {
      var vm = this;
      this.hide(false);
      if(this.id===mockset.id)return false;
      model(this, mockset);
      if (vm.nowProject.isPublic != "1") {
        let headers;
        if (vm.headerEditor.getText() != "") {
          try {
            headers = vm.headerEditor.get();
          } catch (e) {
            // console.log(e);
            alert("header格式错误");
            return false;
          }
          var author = vm.nowProject.beginPath;
          if (headers.author != author) {
            headers.author = author;
            vm.headerEditor.set(headers);
          }
        }
        if (vm.param) vm.paramEditor.setText(vm.param);
      }
    }
  }
}
</script>
