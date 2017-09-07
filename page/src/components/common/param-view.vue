<style lang='less'>
  .param-container{
    padding-left: 20px;
    position:relative;
    >span{
      display: inline-block;
    }
    .param{
      &-required{
        width:5px;
        color:@red-color;
        position: absolute;
        left: 10px;
        &.required::after{
          content:"*"
        }
      }
      &-description{
        color: @gray-color;
        font-size: 13px;
        &::before{
          content:"//"
        }
        &:empty:before{
          content:""
        }
      }

      &-ref{
        margin-left: 5px;
      }

    }
    
  }
</style>
<template>
  <div class="param-container">
      <span class="param-required" v-if="model.name" :class="{'required': model.required}"></span>
      <span class="param-name" v-if="model.name">{{model.name}}<span class="param-split">:</span></span>
      <template v-if="model.type == 'object'">
        <span v-if="model.ref" class="param-ref link" @click="initObject=true;showObject=!showObject">{{model.ref}}</span>
        <template v-if="model.additionalProperties">{{model.additionalProperties.type}}</template>
        <template v-else-if="initObject">
          <span class="param-view-prefix" v-show="showObject">{</span>
          <div class="param-object-container" v-show="showObject" v-if="model.model">
            <paramView v-for="m of model.model" :param="m" :definitions="definitions" :key="m" :show="false"></paramView>
          </div>
          <span class="param-view-prefix" v-show="showObject">}</span>
        </template>
      </template>
      <template v-else-if="model.type == 'array'">
        <span class="param-view-prefix">[</span>
        <div class="param-array-container">
          <paramView :param="model.items" :definitions="definitions" :show="false"></paramView>
        </div>
        <span class="param-view-prefix">]</span>
      </template>
      <template v-else><span class="param-type">{{model.format=='date-time'?'date':model.type}}</span></template>
      <template  v-if="model.name">,</template>
      <span class="param-description">{{model.description}}<template v-if="model.enum">Enum: {{model.enum.join(', ')}}</template></span>
  </div>
</template>
<script>
export default {
  name: 'paramView',
  props: {
    param: Object,
    definitions: Object,
    show: {
      type: Boolean,
      default: true
    }
  },
  beforeMount() {
    this.model = this.getModel(this.param);
  },
  data() {
    return {
      showObject: this.show,
      initObject: this.show,
      model: {},
    };
  },
  methods: {
    initDefinitions(definition) {
      let list = [];
      for(let d in definition.properties){
        list.push(Utils.extend({name: d, required: ((definition.required||[]).indexOf(d)!=-1)}, definition.properties[d]));
      }
      return list;
    },
    getModel(schema) {
      if (schema.type == 'array') {
        return schema;
      }
      if (schema.type == 'object' && schema.properties) {
        return {
          type: 'object',
          model: schema.properties
        };
      }
      if (schema.$ref) {
        let ref = schema.$ref.substring(14);
        return Utils.extend({
          type: 'object',
          model: this.initDefinitions(this.definitions[ref]),
          ref: ref
        }, schema);
      }
      return schema;
    },
  }
}
</script>
