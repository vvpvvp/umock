<style lang='less'>
  .edit-mockset-vue{
    
  }
</style>
<template>
  <div class="edit-mockset-vue" >
    <header>Mockset</header>
    <div>
      <Form>
        <FormItem label="URL">
          <input type="text" v-model=""/>
        </FormItem>
      </Form>
    </div>
    <footer>
      <Button @click="comfirm">确定</Button>
      <Button @click="$emit('close')">取消</Button>
    </footer>
  </div>
</template>
<script>
import Mockset from '/model/Mockset';

export default {
  components: {
  },
  name: 'mockSetEdit',
  props: {
    params: Object,
  },
  data() {
    return {
      mockset: Mockset.parse('Mockset')
    };
  },
  mounted() {
  },
  methods: {
  }
}
</script>
