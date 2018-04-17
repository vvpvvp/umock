<style lang='less'>
  .mock-data-container{
    padding: 10px 20px;
    width: 700px;
    margin: 20px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    background: #F8F8F8;
    font-family: monospace;
    color: @dark1-color;
    overflow-x: auto;
    p {
      white-space: nowrap;
    }
  }
  .toggleComment{
    margin-right: 10px;
    font-size: 13px;
    .h-switch .h-switch-span.h-switch-small, .h-switch > .h-switch-text{
      vertical-align: middle;
    }
  }
</style>
<template>
  <div>
    <header>{{param.model.ref}}<template v-if="param.model.description">-{{param.model.description}}</template>   <div class="float-right toggleComment"><h-switch v-model="showComment" small>展示注解</h-switch></div></header>
    <div class="mock-data-container">
      <div>
        <p>{</p>
        <p v-for="(m, index) of param.model.model" :key="m.name">&nbsp;&nbsp;&nbsp;&nbsp;{{m.name}}: {{m | dataType}}<template v-if="index < param.model.model.length - 1">, </template><template v-if="(m.description || m.title) && showComment">//{{m.description || m.title}}</template></p>
        <p>}</p>
      </div>
    </div>
    <footer>
      <Button @click="copy">复制</Button>
    </footer>
  </div>
</template>
<script>

import Clipboard from 'clipboard';

const returnType = function(type){
  return {integer: '0', 'date-time': 'Date', string: "''", object: "", boolean: "true", number: '0'}[type];
}
export default {
  components: {
  },
  name: 'mockData',
  props: {
    param: Object,
  },
  data() {
    return {
      computedValue: {},
      showComment: true
    };
  },
  filters: {
    dataType(m){
      if(m.type == 'object'){
        if(m.additionalProperties){
          return `{ ${returnType(m.additionalProperties.type)} }`;
        } else if(m.$ref){
          return `{ ${Utils.getSchema(m.$ref)} }`;
        }
        return `{}`;
      } else if (m.type == 'array') {
        if (m.items.$ref) {
          return `[ ${m.items.$ref.substring(14)} ]`;
        } else {
          return `[ ${returnType(m.items.type)} ]`;
        }
      }

      if (m.$ref) {
        return `${Utils.getSchema(m.$ref)}`;
      } else {
        return returnType(m.type);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      let container = this.$el.querySelector('.mock-data-container');
      let btn = this.$el.querySelector('.h-btn');
      new Clipboard(btn, {
          text: function(trigger) {
            return container.innerText.replace(/\n\s{3,6}/g, '\n\t');
          }
      });
    })
  },
  methods: {
    close() {
      this.$emit('close');
    },
    copy() {
      this.$Message.info('复制成功');
    }
  }
}
</script>
