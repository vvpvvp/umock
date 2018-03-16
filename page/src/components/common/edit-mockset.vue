<style lang='less'>
  .edit-mockset-vue{
    width: 500px;
    .container{
      padding: 20px 40px 20px 0;
    }
  }
</style>
<template>
  <div class="edit-mockset-vue" >
    <header>Mockset</header>
    <div class="container">
      <Form>
        <FormItem label="URL">
          <input type="text" v-model="mockset.url"/>
        </FormItem>
        <FormItem label="说明">
          <input type="text" v-model="mockset.shortDesc"/>
        </FormItem>
        <FormItem label="type">
          <Radio :datas="types" v-model="mockset.type"/>
        </FormItem>
        <FormItem label="描述">
          <textarea type="text" rows="10" v-model="mockset.description"></textarea>
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

export default {
  components: {
  },
  name: 'mockSetEdit',
  props: {
    params: Object,
  },
  data() {
    log(Mockset.parse(this.params.mockset||{}))
    return {
      types: [
        'get',
        'post',
        'put',
        'delete',
        'patch'
      ],
      mockset: {}
    };
  },
  mounted() {
  },
  methods: {
    comfirm() {
      R.Mockset.edit(this.mockset, (resp) => {
        log(resp)
      })
    }
  }
}
</script>
