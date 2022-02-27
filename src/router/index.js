import { createRouter, createWebHistory } from "vue-router";
const HomePage = () => import("@/views/home");
const StorePage = () => import("@/views/store");
const LoginPage = () => import("@/views/login");

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
  // 登录页面
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
