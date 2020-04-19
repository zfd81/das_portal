import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import Login from "@/views/Login";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登陆"
    },
    component: Login
  },
  {
    path: "/dasp",
    name: "Dasp",
    component: () => import(/* webpackChunkName: "about" */ "../views/Dasp.vue")
  },
  {
    path: "/ide",
    name: "IDE",
    component: () => import(/* webpackChunkName: "about" */ "../views/IDE.vue")
  }
];

const router = new VueRouter({
  mode: "history", // 使用 HTML5 的 History 路由模式
  routes
});

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (to.name == "Login") {
      next();
    } else if (store.state.wsx) {
      next();
    } else {
      next({
        path: "/login",
        query: {
          redirect: to.fullPath
        }
      });
    }
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  window.scrollTo(0, 0);
});

export default router;
