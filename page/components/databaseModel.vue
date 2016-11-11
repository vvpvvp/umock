<style scoped>
    table{
        border:1px solid #eee;
    }
    table th{
        background: #337ab7;
        color: #FFF;
    }
    table td,table th{
        border:1px solid #eee;
        padding:6px;
    }

    table tr:hover{
        background-color: #EEE;
    }
</style>
<template>
<div>
    <!-- Fixed navbar -->
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <a class="navbar-brand" href="#">Mock Server</a>
            </div>
            <div id="navbar" class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li><a href="/">Home</a></li>
                    <li><a href="https://github.com/vvpvvp/UMock#readme" target="_blank">文档</a></li>
                    <li class="active"><a>数据库模型</a></li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
        </div>
    </nav>

    <div class="container">
        <div class="page-header">
            <h3>数据库模型</h3>
        </div>
        <div class="">

            <div class="form-inline form-group">
                
            <input type="text" v-model="tableName"><button class="btn btn-primary" @click="search">查询</button>
            </div>
            <div class="showResult">
                <table class="col-md-4">
                    <tr><th>字段</th><th>类型</th><th>大小</th></tr>
                    <tr v-for="r of result.rows">
                        <td>{{r.columnname}}</td>
                        <td>{{r.datatype}}</td>
                        <td>{{r.length}}</td>
                    </tr>
                </table>
                <div class="col-md-8">
                    <pre id="resultModel"><code>{{result.model}}</code></pre>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import  beautify from "js-beautify";
export default {
    data(){
        return {
            tableName:"",
            result:{
                rows:[],
                model:"{}"
            }
        };
    },
    methods: {
        search(){
            var P = this;
            if(this.tableName=="")return false;
            $.get("/umock/databaseModel",{tablename:this.tableName}).done((result)=>{
                if (result.result == "ok") {
                    this.result.rows = result.content.rows;
                    console.log(beautify(JSON.stringify(result.content.model)));
                    this.result.model = beautify(JSON.stringify(result.content.model));
                }
            })
        }
    },
    ready(){
        // this.init();
    }
}
</script>
