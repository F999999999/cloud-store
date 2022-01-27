import { createRouter, createWebHistory } from "vue-router";
const HomePage = () => import("@/views/home");
const StorePage = () => import("@/views/store");

const routes = [
  // 首页
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  // 仓库页面
  {
    path: "/store",
    name: "Store",
    component: StorePage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
