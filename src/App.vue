<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script>
import zhCN from "ant-design-vue/es/locale/zh_CN";

export default {
  data() {
    return {
      locale: zhCN,
    };
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  height: 100%;
}

::-webkit-scrollbar {
  /*滚动条整体样式*/
  /*高宽分别对应横竖滚动条的尺寸*/
  width: 6px;
  height: 6px;
  overflow: auto;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.8);
  background: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0);
  border-radius: 0;
  background: rgba(0, 0, 0, 0);
}
</style>
