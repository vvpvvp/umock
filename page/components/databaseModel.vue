<style scoped>
/*table{
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
    }*/
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
    <div class="row">
      <div class="form-inline" role="form">
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon">数据库表</div>
            <select class="form-control" id="selectChosen" type="text" placeholder="数据库表"></select>
          </div>
        </div>
        <!-- <button type="button" class="btn btn-default" @click="search">查询</button> -->
      </div>
      <hr>
      <div class="row">
        <div class="col-md-4">
          <div class="panel panel-default">
            <div class="panel-heading">数据库结构</div>
            <table class="table">
              <tr>
                <th>字段</th>
                <th>类型</th>
                <th>大小</th>
              </tr>
              <tr v-for="r of result.rows">
                <td>{{r.columnname}}</td>
                <td>{{r.datatype}}</td>
                <td>{{r.length}}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="col-md-8">
          <pre id="resultModel"><code>{{result.model}}</code></pre>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import beautify from "js-beautify";
import select2 from "select2";
require("select2/dist/css/select2.css");
export default {
  data() {
      return {
        tableName: "",
        result: {
          rows: [],
          model: "{}"
        },
        list:[]
      };
    },
    methods: {
      getList(){
        let that = this;
        $.get("/umock/databaseModel/tables").done((result) => {
          if (result.result == "ok") {
            this.list = result.content;
            this.list.unshift("");
            $('#selectChosen').select2({
              data: result.content
            }).on("change",function(argument){
              that.tableName = this.value;
              that.search();
            });
          }
        })
      },
      search() {
        var P = this;
        if (this.tableName == "") return false;
        $.get("/umock/databaseModel", {
          tablename: this.tableName
        }).done((result) => {
          if (result.result == "ok") {
            this.result.rows = result.content.rows;
            // console.log(beautify(JSON.stringify(result.content.model)));
            var modelString = JSON.stringify(result.content.model);
            modelString = modelString.replace(/\"(\S+)\"/g,"$1");
            this.result.model = beautify(modelString);
          }else{
            alert(result.content);
          }
        })
      }
    },
    ready() {
      // this.init();
      this.getList();
    }
}
</script>
