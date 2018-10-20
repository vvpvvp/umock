<style lang='less'>
  .edit-mockset-vue{
    width: 660px;
    margin: 20px auto;
    .container{
      padding: 20px 40px 20px 0;
    }
    footer {
      text-align: center !important;
    }
  }
</style>
<template>
  <div class="edit-mockset-vue" >
    <header>{{mockset.id ? '编辑模拟' : '新增模拟'}}</header>
    <div class="container">
      <Form :model="mockset" :label-width="120" :rules="validationRules">
            <FormItem label="URL" prop="url">
              <input type="text" v-model="mockset.url"/>
            </FormItem>
            <FormItem label="type" prop="type">
              <SwitchList :datas="types" v-model="mockset.type"></SwitchList>
            </FormItem>
            <FormItem label="说明" prop="summary">
              <input type="text" v-model="mockset.summary"/>
            </FormItem>
            <!-- <FormItem label="目录">
              <AutoComplete  :datas="params.menus" :mustMatch="false" v-model="mockset.tags"></AutoComplete>
            </FormItem> -->
            <FormItem label="覆盖类型">
              <SwitchList style="vertical-align: middle;" v-model="mockset.dataHandler" :datas="{over: '覆盖', overlying:'叠加'}"></SwitchList>
              <span>{{{'over': '模拟数据将覆盖返回的数据', 'overlying': '模拟数据将与返回的数据叠加'}[mockset.dataHandler]}}</span>
            </FormItem>
            <FormItem label="模拟数据">
              <AceEditor
                :fontSize="14"
                :showPrintMargin="true"
                :showGutter="true"
                :highlightActiveLine="true"
                mode="javascript"
                theme="tomorrow"
                :onChange="onChange"
                name="editor"
                :defaultValue="mockset.result"
                :editorProps="{$blockScrolling: true}"
              />

              <!-- <textarea type="text" rows="15" v-model="mockset.result"></textarea> -->
            </FormItem>
      </Form>
    </div>
    <footer>
      <Button @click="comfirm" color="primary">确定</Button>
      <Button @click="$emit('close')">取消</Button>
    </footer>
  </div>
</template>
<script>
import Mockset from 'model/Mockset';
import AceEditor from './Ace.component'

export default {
  components: {
    AceEditor
  },
  name: 'mockSetEdit',
  props: {
    params: Object,
  },
  data() {
    // log(Mockset.parse(this.params.mockset||{}))
    return {
      types: {
        get: 'GET',
        post: 'POST',
        put: 'PUT',
        delete: 'DELETE',
        patch: 'PATCH'
      },
      mockset: Mockset.parse(this.params.mockset || {}),
      validationRules: {
        required: [
          'url',
          'type',
          'summary',
        ]
      }
    };
  },
  mounted() {
  },
  methods: {
    comfirm() {
      if (this.mockset.result!=null && this.mockset.result != '') {
        try {
          let result = JSON.parse(this.mockset.result);
          this.mockset.result = JSON.stringify(result,null,2);
        } catch (error) {
          this.$Message.error('模拟数据格式不正确');
          return;
        }
      }
      let mockset = Mockset.dispose(this.mockset);
      R.Mockset.edit(mockset).then((resp) => {
        if(resp.ok) {
          this.$Message('保存成功');
          this.$emit('event', 'success');
          this.$emit('close');
        }
      })
    },
    onChange(content){
      this.mockset.result = content;
    }
  }
}
</script>
