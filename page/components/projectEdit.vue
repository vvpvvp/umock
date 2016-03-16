<template>
    <div class="modal fade" id="projectModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="exampleModalLabel">项目</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="recipient-name" class="control-label">项目名称:</label>
                        <input type="text" class="form-control" v-model="name">
                    </div>
                    <div class="form-group">
                        <label for="recipient-name" class="control-label">描述:</label>
                        <input type="text" class="form-control" v-model="desc">
                    </div>
                    <div class="form-group">
                        <label for="recipient-name" class="control-label">种类:</label>
                    </div>
                    <div class="form-group">
                        <label class="radio-inline">
                            <input type="radio" name="type" v-model="isPublic" value=1> URL前缀
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="type" v-model="isPublic" value=0> HEAD参数
                        </label>
                    </div>
                    <div class="form-group">
                        <label for="recipient-name" class="control-label">前缀区分/设定HEAD的author参数:</label>
                        <input type="text" class="form-control" v-model="beginPath">
                    </div>
                    <div class="form-group">
                        <label for="recipient-name" class="control-label">反向代理地址:</label>
                        <input type="text" class="form-control" v-model="proxy">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" v-if="editing" class="btn btn-danger" id="editButton" v-on:click="delete">删除</button>
                    <button type="button" class="btn btn-primary" id="editButton" v-on:click="save">保存</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
function valid(param) {
    if (param.name === "" || param.beginPath === "" || param.proxy === "") {
        alert("参数不全");
        return false;
    } else if (param.beginPath.isPublic==1&&param.beginPath.indexOf("\/") !== 0) {
        alert("url必须以/开头");
        return false;
    } else if (param.beginPath.indexOf("/umock") != -1) {
        alert("url不能以/umock开头，与现在的url冲突");
        return false;
    }
    return true;
}

function emptyEdit(v_project) {
    $.extend(v_project, getEmptyObject());
}

function getEmptyObject() {
    return {
        _id: "",
        name: "",
        desc: "",
        beginPath: "",
        isPublic:"1",
        proxy: "",
        editing: false
    }
}

function model(toO, fromO) {
    toO._id = fromO._id;
    toO.name = fromO.name;
    toO.beginPath = fromO.beginPath;
    toO.isPublic = fromO.isPublic;
    toO.desc = fromO.desc;
    toO.proxy = fromO.proxy;
}

export default {
    props: ['projects'],
    data() {
        return getEmptyObject();
    },
    ready() {
        var v_project = this;
        var projectModal = $('#projectModal');
        projectModal.on('shown.bs.modal', function(event) {
            var button = $(event.relatedTarget);
            var type = button.data('type');
            if (type == "create") {
                v_project.editing = false;
            } else {
                var num = button.data('id');
                v_project.editing = true;
                v_project.num = num;
                model(v_project, v_project.projects[num]);
            }
        }).on("hide.bs.modal", function() {
            emptyEdit(v_project);
        });
    },
    methods: {
        save(event) {
            var vm = this;
            Vue.nextTick(function() {
                var param = {};
                model(param, vm);
                if (valid(param) === false) return false;
                if (!vm.editing) {
                    $.post("/umock/project", param)
                        .done(function(result) {
                            if (result.result == "ok") {
                                vm.projects.push(result.content);
                                $(vm.$el).modal("hide");
                            } else {
                                alert("出错！");
                            }
                        })
                } else {
                    $.post("/umock/project/" + param._id, param)
                        .done(function(result) {
                            if (result.result == "ok") {
                                model(vm.projects[vm.num], param);
                                $(vm.$el).modal("hide");
                            } else {
                                alert("出错！");
                            }
                        })
                }

            });
        },
        delete() {
            var vm = this;
            if(!confirm("确定删除"))return;
            $.ajax({
                    url: "/umock/project/" + vm._id,
                    type: "delete"
                })
                .done(function(result) {
                    if (result.result == "ok") {
                        window.location.reload();
                    }else {
                        alert("出错！");
                    }
                })
        }
    }
}
</script>
