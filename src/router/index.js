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
// // 定义路由导航守卫

// to代表我要去哪个路由 from代表我来自哪个路由
// next代表 下一步去哪里 如果next()代表方形 如果next('/login')是强制跳转至/login路由
router.beforeEach((to, from, next) => {
  // 获取存在window里的token值 用来判断
  let token = window.localStorage.getItem("token");
  console.log(token);
  // 判断如果准备去的路由的name不是Login登入页面 并且没有授权的时候 强制跳转至name为Login的路由页面
  if (to.name !== "Login" && !token)
    next({
      name: "Login",
    });
  // 如果满足通过条件(去往login页面之外的路由 并且授权过) 则放行
  else next();
});
export default router;
