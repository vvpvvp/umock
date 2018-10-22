<style lang='less'>
  .show-data-vue{
    width: 660px;
    padding: 0 0 20px 0;
  }
</style>
<template>
  <div class="show-data-vue" >
    <header>生成数据</header>
    <AceEditor
      :wrapEnabled="true"
      :fontSize="14"
      :showPrintMargin="true"
      :showGutter="true"
      :highlightActiveLine="true"
      readonly
      mode="json"
      theme="tomorrow"
      name="editor"
      width="660"
      :defaultValue="params.content"
      :editorProps="{$blockScrolling: true}"
    />
  </div>
</template>
<script>
import AceEditor from './Ace.component'

export default {
  components: {
    AceEditor
  },
  name: 'showmockdata',
  props: {
    params: Object,
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  }
}
</script>
