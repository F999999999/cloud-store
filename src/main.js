import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入全局样式
import "@/assets/style/common.css";

// 引入 ant-design-vue
import antDesignVue from "ant-design-vue";
// 引入 ant-design-vue 官方提供的暗色 css 样式
import "ant-design-vue/dist/antd.dark.css";

// 使用 dayjs 作为时间库
import dayjs from "dayjs";
// 全局配置 dayjs 时间库的语言为中文
import locale_zh_CN from "dayjs/locale/zh-cn";
dayjs.locale(locale_zh_CN);

createApp(App).use(store).use(router).use(antDesignVue).mount("#app");
