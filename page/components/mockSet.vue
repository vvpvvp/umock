<template>
    <div id="mockList">
        <div v-for="mockset in mocksets" v-bind:class="{'active':mockset.active,'opened':mockset.opened,'mockDiv':true,'POST':mockset.type=='POST','GET':mockset.type=='GET'}">
            <div class="mocksetHeader" v-on:click.self="togglePane">
                <span><span class="mockType">{{mockset.type}}</span><a href="{{mockset.url}}" target="_blank"><code>{{mockset.url}}</code></a><span class="text-info">{{mockset.desc}}</span></span>
                <div class="operator">
                    <button type="button" class="btn btn-default btn-xs" aria-label="Left Align" data-toggle="modal" data-target="#editModal" data-id={{$index}}>
                        <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>编辑
                    </button>
                    <button type="button" class="btn btn-default btn-xs" aria-label="Left Align" data-toggle="modal" data-target="#confirmModal" data-id={{$index}}>
                        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>删除
                    </button>
                    <button type="button" class="btn btn-primary btn-xs" v-if="mockset.active" aria-label="Left Align" v-on:click="disactive" data-id={{$index}}>
                        <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>拦截中
                    </button>
                    <button type="button" class="btn btn-link btn-xs" v-else aria-label="Left Align" v-on:click="active" data-id={{$index}}>
                        <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>已关闭
                    </button>
                </div>
            </div>
            <div class="mocksetContent">
                <h4>Parameters</h4>
                <p>{{mockset.param}}</p>
                <h4>Response</h4>
                <p>{{mockset.respParam}}</p>
                <div>
                    <h4>Result</h4>
                    <pre><code class="json">{{mockset.result}}</code></pre>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
function changeStatus(event, active) {
    var button = $(event.target);
    var num = button.data('id');
    var content = v_list.mocksets[num];
    $.post("/umock/" + content._id, {
        _id: content._id,
        active: active
    });
    content.active = active;
}

export default {
    props: ['nowProject'],
    data() {
        return {
            // projectStart:"/api/",
            mocksets: []
        };
    },
    methods: {
        active(event) {
            changeStatus(event, true);
        },
        disactive(event) {
            changeStatus(event, false);
        },
        togglePane(event) {
            if ($(event.target).hasClass("mocksetHeader"))
                $(event.target).next().slideToggle();
        },
        init() {
            var M = this;
            $.get("/umock/list/" + M.nowProject._id)
                .done(function(result) {
                    if (result.result == "ok") {
                        M.mocksets = result.content;
                    }
                });
        }
    }
}
</script>
