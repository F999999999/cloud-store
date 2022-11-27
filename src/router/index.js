import { createRouter, createWebHistory } from "vue-router";
const HomePage = () => import("@/views/home");
const StorePage = () => import("@/views/store");
const LoginPage = () => import("@/views/login");
const TodoPage = () => import("@/views/todo");

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
  // 任务列表页面
  {
    path: "/todo",
    name: "Todo",
    component: TodoPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 定义前置路由守卫 to代表要去哪个路由 from代表来自哪个路由 next跳转到下一步 调用next()代表放行
router.beforeEach((to, from, next) => {
  // 获取存储在 localStorage 里的 token 用于判断是否登录
  const token = window.localStorage.getItem("token");
  // 判断如果准备去的路由的name不是Login登入页面 并且没有授权的时候 强制跳转至name为Login的路由页面
  if (to.name !== "Login" && !token) {
    next({ name: "Login" });
  } else if (to.name === "Login" && token) {
    // 如果已经登入 强制跳转至首页
    next({ name: "Home" });
  } else {
    const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    // 判断用户职位
    if (to.name !== "Todo" && userInfo.post === 2) {
      next({ name: "Todo" });
    } else {
      // 如果满足通过条件(去往login页面之外的路由 并且授权过) 则放行
      next();
    }
    console.log(userInfo.post, "post");
  }
});

export default router;
