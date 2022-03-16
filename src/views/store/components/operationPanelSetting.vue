<template>
  <div class="operationPanel-right-setting" style="display: none">
    <!-- 用户信息 -->

    <!--  退出登陆  -->
    <a-button type="danger" :style="{ marginTop: '8px' }" @click="logout">
      退出登陆
    </a-button>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import router from "@/router";
export default {
  name: "operationPanelSetting",
  props: {
    storeId: {
      type: Number,
      default: null,
    },
  },
  setup() {
    const logout = () => {
      // 删除 用户信息
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("userInfo");
      // 跳转到登录页面
      router.push("/login").then(() => {
        // 提示信息
        message.success("已退出登录");
      });
    };

    return { logout };
  },
};
</script>

<style scoped lang="less">
.operationPanel-right-setting {
  height: 100%;
}
</style>
