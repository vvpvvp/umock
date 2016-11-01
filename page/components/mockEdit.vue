<style lang="less" scoped>
</style>
<template>
  <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="exampleModalLabel">信息</h4>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <div class="form-horizontal">
                <div class="form-group">
                  <label for="recipient-name" class="col-sm-2 control-label">URL:</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="mock.url">
                  </div>
                </div>
                <div class="form-group">
                  <label for="recipient-name" class="col-sm-2 control-label">描述:</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="mock.shortDesc">
                  </div>
                </div>
                <div class="form-group">
                  <label for="recipient-name" class="col-sm-2 control-label">模块:</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" list="menu_list" v-model="mock.menuId">
                    <datalist id="menu_list">
                      <option v-for="menu in menus" value="{{mock.menu}}"></option>
                    </datalist>
                  </div>
                </div>
                <!-- <div class="form-group">
                                <label for="recipient-name" class="control-label">描述:</label>
                                <input type="text" class="form-control" v-model="mock.description">
                            </div> -->
                <div class="form-group">
                  <label for="recipient-name" class="col-sm-2 control-label">Type:</label>
                  <div class="col-sm-10">
                    <label class="radio-inline">
                      <input type="radio" name="type" v-model="mock.type" value="GET"> GET
                    </label>
                    <label class="radio-inline">
                      <input type="radio" name="type" v-model="mock.type" value="POST"> POST
                    </label>
                    <label class="radio-inline">
                      <input type="radio" name="type" v-model="mock.type" value="PATCH"> PATCH
                    </label>
                    <label class="radio-inline">
                      <input type="radio" name="type" v-model="mock.type" value="DELETE"> DELETE
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <label for="recipient-name" class="col-sm-2 control-label">数据处理:</label>
                  <div class="col-sm-10">
                    <label class="radio-inline">
                      <input type="radio" name="dataHandler" v-model="mock.dataHandler" value="over"> 完全覆盖
                    </label>
                    <label class="radio-inline">
                      <input type="radio" name="dataHandler" v-model="mock.dataHandler" value="overlying"> 数据叠加
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div id="jsoneditor"></div>
              </div>
              <!-- <div class="form-group">
                                <label for="recipient-name" class="col-sm-2 control-label">参数:</label>
                                <div id="param-jsoneditor"></div>
                            </div> -->
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <div class="mocksetDescriptionDiv">
                  <textarea id="mocksetDescription"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" id="editButton" v-on:click="edit">保存</button>
          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import JSONEditor from "jsoneditor";
import Mock from "../js/Mock"

import ajax from "../js/ajax";
import SimpleMDE from "simplemde/dist/simplemde.min";
require("../css/font-awesome.min.css");
require("simplemde/dist/simplemde.min.css");

function valid(vm, param) {
  if (param.url == null || param.url === "" || param.result === "" || param.type === "") {
    alert("参数不全");
    return false;
  } else if (param.url.indexOf("\/") !== 0) {
    alert("url必须以/开头");
    return false;
  } else if (param.url.indexOf("/umock") != -1) {
    alert("url不能以/umock开头，与现在的url冲突");
    return false;
  } else if (vm.nowProject.isPublic == "1" && param.url.indexOf(vm.nowProject.beginPath) != 0) {
    alert("url必须以" + vm.nowProject.beginPath + "为开头！");
    return false;
  }
  return true;
}

function emptyEdit(vm) {
  vm.mock = Mock.parse({});
  vm.editor.set({});
}

function getEmptyObject() {
  return Mock.parse({});
}

export default {
  props: ['mocksets', "nowProject", "menus"],
  data() {
    return {
      editType: "create",
      mock: Mock.parse({})
    }
  },
  ready() {
    var that = this;
    var editModal = $(that.$el);
    editModal.on('shown.bs.modal', function(event) {
      var button = $(event.relatedTarget);
      var type = button.data('type');
      if (type == "create") {
        that.editType = "create";
      } else {
        var num = button.data('id');
        var mockset = that.getById(num);
        that.mockset = mockset;
        that.mock = Mock.parse(mockset);
        let mock = that.mock;
        that.editor.set(JSON.parse(mock.result));
        if(mock.description)that.simplemde.value(mock.description);
        that.editType = "edit";
      }
    }).on("hide.bs.modal", function() {
      emptyEdit(that);
    });

    var container = document.getElementById('jsoneditor');
    // var paramContainer = document.getElementById('param-jsoneditor');

    var options = {
      mode: 'code',
      modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
      onError: function(err) {
        alert(err.toString());
      },
      onModeChange: function(newMode, oldMode) {
        console.log('Mode switched from', oldMode, 'to', newMode);
      }
    };

    that.editor = new JSONEditor(container, options, {});
    that.simplemde = new SimpleMDE({
      element: document.getElementById('mocksetDescription'),
      spellChecker:false,
      autoDownloadFontAwesome:false
    });
    // that.paramEditor = new JSONEditor(paramContainer, options, {});
  },
  methods: {
    edit: function(event) {
      var vm = this;

      Vue.nextTick(function() {

        var param = vm.mock;
        param.result = JSON.stringify(vm.editor.get(), null, 2);
        // console.log(vm.simplemde.value());
        param.description = vm.simplemde.value();
        if (valid(vm, param) === false) return false;
        if (vm.editType == "create") {
          param.projectId = vm.nowProject.id;
          // param.menuId = vm.nowProject.id;
          ajax.postJson("/umock/mockset", param)
            .done(function(result) {
              if (result.result == "ok") {
                vm.mocksets.push(result.content);
                $(vm.$el).modal("hide");
                vm.$dispatch("reInitMenu");
              } else {
                alert("出错！");
              }
            })
        } else {
          param.projectId = vm.nowProject.id;
          ajax.postJson("/umock/mockset/" + param.id, Mock.dispose(param))
            .done(function(result) {
              if (result.result == "ok") {
                $(vm.$el).modal("hide");
                $.extend(vm.mockset,param);
                vm.$dispatch("reInitMenu");
              } else {
                alert("出错！");
              }
            })
        }

      });
    },
    getById(id) {
      let vm = this;
      return vm.mocksets.filter((item) => {
        return item.id == id;
      })[0];
    }
  }
}
</script>
