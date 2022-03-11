import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 全局样式
import "./assets/common.css";
// 引入 ant-design-vue
import antDesignVue from "ant-design-vue";
// 引入ant-design-vue样式
import "ant-design-vue/dist/antd.css";

createApp(App).use(store).use(router).use(antDesignVue).mount("#app");
