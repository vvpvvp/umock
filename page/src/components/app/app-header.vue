<style lang="less">

.app-header-dropdown{
  padding: 0 10px 0 20px;
  &:hover, &.@{pop-ref-prefix}{
    background: @gray3-color;
  }
}
</style>
<template>
  <div class="app-header">
    <div>
      <span class="app-header-title"><router-link to="/">UMock</router-link></span>
      <div class="float-right app-header-info">
        <a href="https://github.com/vvpvvp/umock#readme" v-font="25" target="_blank"><i class="h-icon-github"></i></a>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      infoMenu: [
        { key: 'logout', title: '退出登录', icon: 'h-icon-outbox' },
      ]
    }
  },
  methods: {
    trigger(data) {
      if (data == 'logout') {
        Utils.removeLocal('Auth');
        window.location = '/login.html';
      }
    }
  }
}
</script>
