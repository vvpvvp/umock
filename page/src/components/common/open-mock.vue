<style lang='less'>
  .open-mockset-vue{
    width: 620px;
    margin: 20px auto;
    .container{
      padding: 20px 40px 20px 0;
    }
  }
</style>
<template>
  <div class="open-mockset-vue" >
    <header>Open Mock</header>
    <div class="container">
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
  name: 'openMock',
  props: {
    params: Object,
  },
  data() {
    return {
      mockset: Mockset.parse(this.params.mockset || {})
    };
  },
  mounted() {
  },
  methods: {
    comfirm() {
      let mockset = Mockset.dispose(this.mockset);
      mockset.result = content;
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
