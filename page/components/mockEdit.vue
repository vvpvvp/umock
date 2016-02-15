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
                            <div class="form-group">
                                <label for="recipient-name" class="control-label">URL:</label>
                                <input type="text" class="form-control" v-model="url">
                            </div>
                            <div class="form-group">
                                <label for="recipient-name" class="control-label">描述:</label>
                                <input type="text" class="form-control" v-model="desc">
                            </div>
                            <div class="form-group">
                                <label for="recipient-name" class="control-label">Type:</label>
                            </div>
                            <div class="form-group">
                                <label class="radio-inline">
                                    <input type="radio" name="type" v-model="type" value="GET"> GET
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" name="type" v-model="type" value="POST"> POST
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" name="type" v-model="type" value="PATCH"> PATCH
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" name="type" v-model="type" value="DELETE"> DELETE
                                </label>
                            </div>
                            <div class="form-group">
                                <label for="recipient-name" class="control-label">数据处理:</label>
                            </div>
                            <div class="form-group">
                                <label class="radio-inline">
                                    <input type="radio" name="dataHandler" v-model="dataHandler" value="over"> 完全覆盖
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" name="dataHandler" v-model="dataHandler" value="overlying"> 数据叠加
                                </label>
                            </div>
                            <div class="form-group">
                                <label for="recipient-name" class="control-label">参数:</label>
                                <textarea class="form-control" rows="5" v-model="param"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="recipient-name" class="control-label">返回格式:</label>
                                <textarea class="form-control" rows="5" v-model="respParam"></textarea>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="message-text" class="control-label">Result:</label>
                                <div id="jsoneditor"></div>
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

function valid(vm,param) {
    if (param.url === "" || param.result === "" || param.type === "") {
        alert("参数不全");
        return false;
    } else if (param.url.indexOf("\/") !== 0) {
        alert("url必须以/开头");
        return false;
    } else if (param.url.indexOf("/umock") != -1) {
        alert("url不能以/umock开头，与现在的url冲突");
        return false;
    } else if (param.url.indexOf(vm.nowProject.beginPath) != 0) {
        alert("url必须以" + vm.nowProject.beginPath + "为开头！");
        return false;
    }
    return true;
}

function emptyEdit(v_edit) {
    $.extend(v_edit, getEmptyObject());
    v_edit.editor.set({});
}

function getEmptyObject() {
    return {
        num: 0,
        _id: "",
        url: "",
        desc: "",
        result: "",
        respParam: "",
        dataHandler: "",
        param: "",
        type: "",
        active: true
    }
}

function model(toO, fromO) {
    toO._id = fromO._id;
    toO.url = fromO.url;
    toO.result = fromO.result;
    toO.desc = fromO.desc;
    toO.type = fromO.type;
    toO.dataHandler = fromO.dataHandler;
    toO.param = fromO.param;
    toO.respParam = fromO.respParam;
    if (fromO.active != undefined) toO.active = fromO.active;
}

export default {
    props: ['mocksets',"nowProject"],
    data() {
        return getEmptyObject();
    },
    ready() {
        var v_edit = this;
        var editModal = $(v_edit.$el);
        editModal.on('shown.bs.modal', function(event) {
            var button = $(event.relatedTarget);
            var type = button.data('type');
            if (type == "create") {
                v_edit.editType = "create";
            } else {
                var num = button.data('id');
                var content = v_edit.mocksets[num];
                v_edit.num = num;
                model(v_edit, content);
                // v_edit.result = content.result;
                v_edit.editor.set(JSON.parse(v_edit.result));
                v_edit.editType = "edit";
            }
        }).on("hide.bs.modal", function() {
            emptyEdit(v_edit);
        });

        var container = document.getElementById('jsoneditor');

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

        v_edit.editor = new JSONEditor(container, options, {});
    },
    methods: {
        edit: function(event) {
            var vm = this;
            Vue.nextTick(function() {
                vm.result = JSON.stringify(vm.editor.get(), null, 2);
                var param = {};
                model(param, vm);
                if (valid(vm,param) === false) return false;
                if (vm.editType == "create") {
                    param.menuId = vm.nowProject._id;
                    $.post("/umock/mockset", param)
                        .done(function(result) {
                            if (result.result == "ok") {
                                vm.mocksets.push(result.content);
                                $(vm.$el).modal("hide");
                            } else {
                                alert("出错！");
                            }
                        })
                } else {
                    var param = {};
                    model(param, vm);
                    $.post("/umock/mockset/" + param._id, param)
                        .done(function(result) {
                            if (result.result == "ok") {
                                model(vm.mocksets[vm.num], param);
                                $(vm.$el).modal("hide");
                            } else {
                                alert("出错！");
                            }
                        })
                }

            });
        }
    }
}
</script>
