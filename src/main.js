import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/common.css";
import antDesignVue from "ant-design-vue";
// 引入ant-design-vue样式
import "ant-design-vue/dist/antd.css";

createApp(App).use(store).use(router).use(antDesignVue).mount("#app");
