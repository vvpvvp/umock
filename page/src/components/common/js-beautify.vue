<template>
  <pre><code>{{model}}</code></pre>
</template>
<script>
import beautify from "js-beautify";
export default {
  props: {
    value: [Object, String]
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      model: ""
    }
  },
  methods: {
    init() {
      let modelString = this.value;
      if(Utils.isObject(this.value)){
        modelString = JSON.stringify(this.value);
      }
      modelString = modelString.replace(/\"(\S+)\"/g,"$1");
      this.model = beautify(modelString);
    }
  },
  watch: {
    value() {
      this.init();
    }
  }
}
</script>
