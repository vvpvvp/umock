<style lang='less'>
  .edit-mockset-vue{
    width: 620px;
    margin: 20px auto;
    .container{
      padding: 20px 40px 20px 0;
    }
  }
</style>
<template>
  <div class="edit-mockset-vue" >
    <header>Mockset</header>
    <div class="container">
      <Form :model="mockset" :rules="validationRules">
        <FormItem label="URL" prop="url">
          <input type="text" v-model="mockset.url"/>
        </FormItem>
        <FormItem label="说明" prop="shortDesc">
          <input type="text" v-model="mockset.shortDesc"/>
        </FormItem>
        <FormItem label="type" prop="type">
          <SwitchList :datas="types" v-model="mockset.type"></SwitchList>
        </FormItem>
        <FormItem label="目录">
          <AutoComplete  :datas="params.menus" :mustMatch="false" v-model="mockset.menuId"></AutoComplete>
        </FormItem>
        <FormItem label="描述">
          <AceEditor
            :fontSize="14"
            :showPrintMargin="true"
            :showGutter="true"
            :highlightActiveLine="true"
            mode="markdown"
            theme="monokai"
            :onChange="onChange"
            name="editor"
            :defaultValue="mockset.description"
            :editorProps="{$blockScrolling: true}"
          />

          <!-- <textarea type="text" rows="10" v-model=""></textarea> -->
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
          'shortDesc',
        ]
      }
    };
  },
  mounted() {
  },
  methods: {
    comfirm() {
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
      this.mockset.description = content;
    }
  }
}
</script>
