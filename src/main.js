import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 重置公共样式
import "@/assets/style/reset.css";
// 引入全局样式
import "@/assets/style/common.css";

// 引入 ant-design-vue
import antDesignVue from "ant-design-vue";
// 引入 ant-design-vue 样式
// import "ant-design-vue/dist/antd.css";
// 引入 ant-design-vue 官方提供的暗色 css 样式
import "ant-design-vue/dist/antd.dark.css";

createApp(App).use(store).use(router).use(antDesignVue).mount("#app");
